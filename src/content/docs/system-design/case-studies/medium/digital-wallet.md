---
title: "Design a Digital Wallet (like Paytm Wallet / PayPal balance)"
description: "Design a stored-balance wallet: top-ups, transfers and withdrawals on a double-entry ledger, no negative balances, cross-shard sagas, hot accounts and reconciliation."
difficulty: "Medium"
sidebar:
  label: "Digital wallet (like Paytm Wallet)"
tags: ["Payments", "Ledger", "Consistency", "Databases", "Idempotency"]
---

A digital wallet looks like a number on a screen: **₹1,250.00**. You add money from your bank, send some to a
friend, pay a shop, and withdraw the rest. Underneath, that number is a **promise**. The wallet company owes you
₹1,250, and it must be able to prove, to the paisa, how every rupee got there, for years, while millions of
people move money at the same time.

That makes a wallet different from a [payment gateway](/system-design/case-studies/medium/payment-system/),
which passes money from a card to a merchant and keeps nothing, and from [UPI](/system-design/case-studies/easy/upi/),
which moves money directly between bank accounts. A wallet **holds** money. So its heart is not a payment flow,
it is a **ledger**: an append-only book of every movement, kept so that money can never be created, lost or spent
twice.

This case study builds that ledger and the service around it from first principles, then goes deep on what
interviewers push on: concurrency on one wallet, transfers across database shards, idempotency, hot merchant
accounts and reconciliation with banks.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Wallets in 5 minutes: where the money really is

When you "add ₹1,000 to your wallet", the ₹1,000 does not go into your phone. It leaves your bank account and
lands in a **pooled bank account** owned by the wallet company and held at a partner bank. In India, for
example, a non-bank wallet issuer must keep customers' money in an **escrow account** at a bank. Your wallet
balance is the company's record of how much of that pool belongs to you.

So the real money sits in **one** big bank account, and the wallet company's database decides who owns which
slice of it. Moving ₹300 from Alice's wallet to Bob's moves **no** real money at all: it only changes the
records. That is why wallet-to-wallet payments are instant and free, and why the records must be perfect.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Wallet (stored value)** | A balance the company owes you, backed by money in its pooled bank account | Credit at a shop's counter |
| **Top-up (load)** | Moving money from your bank or card into the wallet | Buying tokens at an arcade |
| **P2P transfer** | Wallet to wallet; only records change | Moving a token from your pile to a friend's |
| **Withdrawal (payout)** | Wallet back to a bank account | Cashing in the tokens |
| **Ledger** | The append-only record of every money movement | The arcade's account book, written in pen |
| **Double-entry** | Every movement is written twice: out of one account, into another; the two always cancel out | Every token taken from one pile is put on another |
| **Minor units** | Amounts stored as whole paise (or cents), never as decimals | Counting coins instead of guessing weights |
| **Idempotency key** | A unique ID per request so a retry cannot move money twice | A numbered cheque: the bank never cashes number 1042 twice |
| **KYC** | *Know Your Customer*: checking who a user really is | Showing ID to open a bank account |
| **Reconciliation** | Comparing our records with the banks' records, line by line | Checking your passbook against your own notes |

Here is how ₹1,000 flows through the ledger when Alice tops up, pays Bob and a shop, and Bob withdraws:

[![Money map: Alice's card or UPI payment of 1,000 rupees enters the top-up clearing system account and is credited to Alice's wallet; Alice sends 300 rupees to Bob's wallet and pays 200 rupees to the shop's wallet; the shop pays a 4 rupee fee to the fee revenue account; Bob withdraws 300 rupees through the payout clearing account to his bank by bank transfer](/img/system-design/digital-wallet/01-money-map.png)](/img/system-design/digital-wallet/01-money-map.png)

*Select the diagram to zoom in and move around.*

Two ideas from this picture shape the whole design:

1. **User wallets are only some of the accounts.** Money enters and leaves through **system accounts** (top-up
   clearing, payout clearing, fee revenue). Every rupee is always *somewhere* in the ledger, so the books always
   add up.
2. **Inside the system, money only moves between accounts; it is never created or destroyed.** If the total of
   all accounts ever changes, there is a bug, and we can detect it.

## 2. Requirements

### Functional (what users can do)

- **Top up** the wallet from a debit/credit card, UPI or net banking.
- **Send money** to another user's wallet (by phone number or wallet ID), instantly.
- **Pay merchants** from the wallet (online checkout and QR codes in shops).
- **Withdraw** the balance to a linked bank account.
- **See the balance** and a **transaction history**; download monthly **statements**.
- **Refunds** from merchants back into the wallet.
- **KYC tiers**: a quick sign-up with low limits, upgraded after identity checks.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Correctness** | No money created or lost; a balance never goes below zero; every movement balanced | This is the job. A wrong balance is a loss, a fine or a lawsuit |
| **Durability** | A confirmed transaction is never lost (zero data loss on failover) | "Sent" must mean sent |
| **Consistency** | Strong for balances and transfers; eventual (seconds) for history, statements, analytics | You cannot spend a balance twice; a statement can lag |
| **Availability** | 99.99% for payments | People pay at the shop counter; downtime is lost sales |
| **Latency** | Transfer confirmed in under 500 ms at p99; balance read in under 100 ms | It should feel like cash |
| **Scale** | ~100 million users, ~10,000 money movements per second at peak | Big festival sales and evening peaks |
| **Auditability** | Every change traceable to a request, a user or an operator; kept for years | Regulators, auditors and dispute teams will ask |

When correctness and availability conflict, **correctness wins**. If the ledger cannot be sure a transfer is
safe, it refuses the transfer. A declined payment is annoying; a duplicated one is a loss.

### Out of scope

Card processing internals (see the [payment system](/system-design/case-studies/medium/payment-system/) case
study), UPI rails (see [UPI](/system-design/case-studies/easy/upi/)), credit and lending, multi-currency
foreign exchange, and the app's UI. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** 100 million users, 30 million active each day. Each active user makes **3** money movements a
day (top-up, transfer, payment, withdrawal) and checks their balance or history **10** times. Peak traffic is
**10×** average (a festival sale). Each movement writes one journal entry and about **3** postings (two sides,
sometimes a fee). A posting row with its indexes takes about **200 bytes**.

**Traffic**

- Money movements: $30\text{M} \times 3 = 90\text{M}$ a day, about **1,040 per second** on average and roughly
  **10,000 per second** at peak.
- Balance and history reads: $30\text{M} \times 10 = 300\text{M}$ a day, about **3,500 per second**, with
  peaks of 35,000 per second.

**Storage**

- Postings: $90\text{M} \times 3 = 270\text{M}$ rows a day; $270\text{M} \times 200\text{ B} \approx 54\text{ GB}$
  a day, about **20 TB a year**, or **60 TB** with three replicas.
- Financial records are usually kept for many years (often 5–10, set by regulation), so the ledger grows to
  hundreds of terabytes. Old months must move to cheaper storage while staying queryable.

**What this tells us**

1. **Writes are what's hard**, not storage. Assume one well-tuned relational primary handles about 3,000 of
   these small transactions per second. Then 10,000 per second needs at least 4 primaries. So we split the ledger into
   **shards** (independent databases, each holding a slice of the accounts) and, with headroom for growth, run
   about **8 shards**.
2. With 8 shards and users spread randomly, a transfer between two random users lands on the **same** shard only
   1 time in 8. So **most transfers cross shards** (section 10).
3. **Reads are higher than writes but easy:** a balance is one row, and history can come from replicas.

## 4. The API

Clients talk to us over HTTPS with JSON. Every request that moves money carries an `Idempotency-Key` header,
a UUID the app creates **once per user action** and reuses on every retry of that action.

| Method and path | What it does |
| --- | --- |
| `POST /v1/topups` | Start a top-up. Body: `{"amount_minor": 100000, "currency": "INR", "method": "card"}`. Returns a `topup_id` in `PENDING` and a checkout link from the payment gateway. |
| `POST /v1/transfers` | Send money to another wallet. Body: recipient, `amount_minor`, note. Returns `transfer_id` and `status`. |
| `POST /v1/payments` | Pay a merchant (from checkout or a scanned QR code). |
| `POST /v1/withdrawals` | Withdraw to a linked bank account. Returns a `withdrawal_id` that may stay `PROCESSING` for a while. |
| `GET /v1/wallet` | `{"balance_minor": 70000, "available_minor": 70000, "currency": "INR"}` |
| `GET /v1/wallet/transactions?cursor=...&limit=20` | History, newest first, with a cursor. |
| `GET /v1/statements/2026-10` | A month's statement (opening balance, every movement, closing balance). |
| `POST /internal/webhooks/pg` | The payment gateway tells us a top-up was captured. Signed; never public. |

**How to write money in an API.** `"amount_minor": 100000` means ₹1,000.00: an integer count of paise. Never
send money as a JSON floating-point number. In binary floating point, `0.1 + 0.2` is `0.30000000000000004`, and
after millions of operations those crumbs become real rupees. Integers in minor units (or decimal strings like
`"1000.00"`) are exact. Always send the **currency** too: an amount without a currency is not money.

## 5. High-level design

[![High-level architecture: the wallet app calls the API gateway, which forwards transfers and top-ups to the wallet service; the wallet service asks risk and limits whether a request is allowed, posts journals to the ledger service, which appends to the ledger DB sharded by account, and uses the bank connector to charge and pay out through the payment gateway and partner banks; the ledger publishes outbox events to an event stream, which feeds read models for statements and push, and reconciliation, which also receives bank files](/img/system-design/digital-wallet/02-architecture.png)](/img/system-design/digital-wallet/02-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** authenticates the user (OAuth tokens plus device binding), rate-limits, routes.
- **Wallet service:** the **orchestrator** of user-level flows (top-up, transfer, payment, withdrawal). It
  owns idempotency and each flow's state machine, but never edits balances itself.
- **Risk + limits:** answers "is this allowed?" in a few milliseconds: KYC tier limits, velocity rules, fraud
  score (section 13).
- **Ledger service:** the **only** component allowed to change balances. It accepts a balanced journal entry
  and applies it atomically, or rejects it.
- **Ledger DB:** the source of truth, a relational database sharded by account ID.
- **Bank connector:** talks to the outside world: payment gateways for top-ups, bank payout APIs for withdrawals,
  and their webhooks.
- **Event stream:** every committed journal is announced (via the outbox pattern, section 11) for statements,
  notifications, analytics, fraud models and reconciliation.

The most important rule in this design: **one narrow door to the money**. Everything else can be retried,
cached, replayed or rebuilt. The ledger service is small, heavily reviewed and boring on purpose.

## 6. The ledger: double-entry bookkeeping

### Why not just a `balance` column?

The obvious design is a `wallets` table with a `balance` column, and `UPDATE wallets SET balance = balance - 300`
for each payment. It works until someone asks "why is my balance ₹700?" and you have no answer, or a bug adds
₹300 to Bob without taking it from Alice and nobody notices for a month.

Accountants solved this five centuries ago with **double-entry bookkeeping**. Every movement of money is a
**journal entry** made of two or more **postings** (lines), each changing one account. The rule: **the postings
of one journal entry always sum to zero.** Money leaves one place and arrives in another, so it can never appear
from nowhere.

We store each posting as a **signed amount in minor units**: positive means money into the account, negative
means money out. Here are the journal entries from the money map in section 1:

| Journal entry | Account | Amount (₹) |
| --- | --- | --- |
| J1: Alice tops up | Top-up clearing | −1,000 |
| | Alice's wallet | +1,000 |
| J2: Alice pays Bob | Alice's wallet | −300 |
| | Bob's wallet | +300 |
| J3: Alice pays the shop | Alice's wallet | −200 |
| | Shop's wallet | +200 |
| J4: the shop pays our 2% fee | Shop's wallet | −4 |
| | Fee revenue | +4 |
| J5: Bob withdraws | Bob's wallet | −300 |
| | Payout clearing | +300 |

Every entry sums to zero, so the sum of **all** accounts is always zero. That one property is a cheap, powerful
bug detector: run it every few minutes, and page someone if it is ever not zero. (Accountants say "debit" and
"credit" instead of minus and plus; signed amounts encode the same rule.)

**System accounts** are what make the books close:

- **Top-up clearing**: money a gateway has captured for us but not yet sent to our bank. Its negative balance
  means "the gateway owes us this". When the gateway settles to the escrow account (often a day later), a
  settlement journal brings it back to zero.
- **Payout clearing**: money promised to banks for withdrawals in progress.
- **Fee revenue**, **promotions / cashback** (the marketing budget paying users), **refunds**, **chargebacks**,
  and **suspense** (money we cannot yet attribute, waiting for an investigation).

A global invariant follows: **the total of all user and merchant wallets must equal the money in the escrow
bank account**, after adjusting for items still in clearing. Reconciliation checks it every day (section 14).

### The data model

[![Ledger data model: an account has one cached account_balances row and many postings and holds; a journal entry with a unique idempotency key has many postings, whose amounts sum to zero](/img/system-design/digital-wallet/03-data-model.png)](/img/system-design/digital-wallet/03-data-model.png)

*Select the diagram to zoom in and move around.*

Decisions hiding in this diagram:

**1. Accounts, not users.** A user may own a wallet account; a merchant may own several; the company owns the
system accounts. `kind` says which, and `currency` is fixed per account. Converting currency is its own journal
entry through an FX account, never a silent multiplication.

**2. Postings are append-only.** No `UPDATE`, no `DELETE`, ever. A mistake is corrected with a **new** journal
entry that reverses it. The history is then complete, which is exactly what auditors want.

**3. `bigint` minor units everywhere.** A signed 64-bit integer holds about $9.2 \times 10^{18}$ paise, far more
than all the money in the world. Fees that do not divide evenly (2% of ₹0.99) need an explicit **rounding
rule**, and the leftover paisa is posted somewhere on purpose (usually to the fee or a rounding account), so the
entry still sums to zero.

**4. `idempotency_key` is unique on `journal_entries`.** If the same request arrives twice, the second insert
fails on the unique index and we return the first result. The database enforces it, not application code.

**5. `holds` reserve money without moving it.** A withdrawal in progress places a hold; the spendable amount is
`balance_minor - held_minor`. Card systems call this an authorisation.

### Balance: derived or cached?

In principle, a balance is **derived**: the sum of an account's postings. That is the truth, but summing a
merchant's 50 million postings on every payment is far too slow. So we also keep a **cached balance** in
`account_balances`, and the rule that keeps the two consistent is simple:

> The cached balance is updated **in the same database transaction** as the postings that change it.

Either both commit or neither does, so the cache can never drift because of a crash. Three extras make it robust:

- `postings.balance_after` stores the running balance on each line. Statements and "balance on 31 March"
  become a single lookup, not a sum.
- A **verifier job** recomputes `sum(postings)` per account (incrementally, from the last checkpoint) and
  compares it with the cached value. A mismatch is a bug and an incident.
- A `CHECK (balance_minor >= 0)` constraint on user wallets is the last line of defence against a negative
  balance, even if application code is wrong.

A Redis cache in front of balances is fine **for display** only. Never decide whether a payment may go through
from a cache: that decision is always made inside the ledger transaction.

## 7. Flow 1: a wallet-to-wallet transfer

Alice sends Bob ₹300. Assume, for now, both accounts live on the same ledger shard.

[![Transfer sequence: Alice's app sends 300 rupees to Bob with idempotency key k1; the wallet service checks the key and asks risk and limits, which allows it; the ledger service begins a transaction, locks both balance rows in account-ID order, checks Alice's balance, inserts the journal and two postings, updates balances and the outbox and commits; the wallet service replies with the new balance of 700 rupees; an outbox relay publishes the event](/img/system-design/digital-wallet/04-transfer.png)](/img/system-design/digital-wallet/04-transfer.png)

*Select the diagram to zoom in and move around.*

Inside the ledger, steps 5 to 7 are **one** database transaction:

```sql
BEGIN;
-- lock both rows, always in ascending account_id order
SELECT balance_minor, held_minor FROM account_balances
 WHERE account_id IN (:alice, :bob) ORDER BY account_id FOR UPDATE;
-- application checks: Alice's balance_minor - held_minor >= 30000, else ROLLBACK
INSERT INTO journal_entries (idempotency_key, kind, ...) VALUES ('k1', 'P2P', ...);
INSERT INTO postings (journal_id, account_id, amount_minor, balance_after, ...)
VALUES (:j, :alice, -30000, 70000, ...), (:j, :bob, 30000, 45000, ...);
UPDATE account_balances SET balance_minor = 70000, version = version + 1 WHERE account_id = :alice;
UPDATE account_balances SET balance_minor = 45000, version = version + 1 WHERE account_id = :bob;
INSERT INTO outbox_events (journal_id, event_type, payload) VALUES (:j, 'TRANSFER_POSTED', ...);
COMMIT;
```

The database commits with **synchronous replication** to at least one other machine, so a confirmed transfer
survives the loss of the primary.

### Deep dive: two payments, one wallet, no negative balance

Alice has ₹500. She taps "Pay ₹400" at a shop and, at the same moment, an old automatic payment of ₹300 fires.
Both requests read "balance ₹500", both decide "enough money", both write. Alice has spent ₹700 of ₹500. This is
the classic **race condition** (also called a *lost update* or *double spend*). There are four standard defences:

| Technique | How it works | Good at | Weak at |
| --- | --- | --- | --- |
| **Pessimistic row lock** | `SELECT ... FOR UPDATE` locks Alice's row; the second payment waits until the first commits, then sees ₹100 | Simple, always correct | Waiting under heavy contention on one row |
| **Conditional update** | `UPDATE account_balances SET balance_minor = balance_minor - 40000 WHERE account_id = :a AND balance_minor - held_minor >= 40000`; zero rows changed means "insufficient funds" | One round trip; the check and the write are one atomic step | Same row contention; still needs postings in the same transaction |
| **Optimistic concurrency** | Read `version`, write `... WHERE version = :v`; if someone else wrote first, re-read and retry | No locks held while thinking | Retry storms on busy accounts |
| **Single writer per account** | Route every command for an account to one partition (for example a Kafka partition) processed by one thread, which keeps the balance in memory | Very high throughput per account, no locks at all | Complex: crash recovery, rebalancing, and transfers touch two writers |

For a typical wallet, **row locks or conditional updates inside the ledger transaction** are the right default:
correct, simple and fast enough, because an ordinary user makes a few payments a day and almost never contends
with themselves. Single-writer designs (as used in some exchange matching engines and specialised ledger
databases) earn their complexity only for extreme throughput.

**Deadlocks.** Alice pays Bob while Bob pays Alice. Transaction 1 locks Alice then waits for Bob; transaction 2
locks Bob then waits for Alice. Both wait forever until the database kills one. The fix is a rule: **always lock
accounts in ascending account ID order.** Then both transactions try Alice first, one waits, and no cycle can
form.

## 8. Flow 2: topping up from a card or UPI

A top-up is the moment real money enters our system, through a [payment gateway](/system-design/case-studies/medium/payment-system/).
The rule: **credit the wallet only after the money is confirmed captured.**

[![Top-up sequence: Alice asks to add 1,000 rupees with key k2 and the wallet service saves top-up T7 as pending, creates an order with the payment gateway and opens checkout; Alice pays by card and OTP or UPI, the gateway debits her bank, which approves; the gateway sends a webhook that T7 was captured, which the wallet service verifies and deduplicates; the wallet service asks the ledger to move 1,000 rupees from top-up clearing to Alice with idempotency key T7, and shows the balance](/img/system-design/digital-wallet/05-topup.png)](/img/system-design/digital-wallet/05-topup.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The top-up is a record before it is money.** Step 1 saves `T7` as `PENDING`. If anything fails later, we
  still know a top-up was attempted and can ask the gateway about it.
- **Webhooks can be lost, duplicated or arrive out of order.** We verify the gateway's signature, use `T7` as
  the idempotency key of the ledger entry (so a second webhook does nothing), and run a **poller** that asks
  the gateway for the status of any top-up still `PENDING` after a few minutes.
- **What the app shows is not what decides.** The checkout page saying "success" is a hint; only the
  server-side confirmation credits the wallet. Otherwise a tampered app could mint money.
- **Card-funded money is riskier.** A stolen card can top up a wallet, send the money onward and withdraw it,
  and weeks later the real cardholder disputes the charge (a **chargeback**). Common defences: keep card-funded
  balances out of bank withdrawals for a cooling-off period, and apply tighter limits to new accounts.

## 9. Flow 3: withdrawing to a bank

A withdrawal is the opposite: real money leaves the escrow account for Bob's bank, using a bank payout rail such
as IMPS (instant) or NEFT (in India) or ACH (in the US). The danger is the **unknown outcome**: the bank call times
out, and we do not know whether the money left.

[![Withdrawal states: Requested moves to Funds held when the balance is enough, then to Sent to bank when the payout call is made, then to Paid when the bank confirms and the bank reference is saved; checks failing leads to Rejected; a bank rejection leads to Reversed; a timeout leads to Unknown, from which a status check leads to Paid or Reversed](/img/system-design/digital-wallet/06-withdrawal.png)](/img/system-design/digital-wallet/06-withdrawal.png)

*Select the diagram to zoom in and move around.*

The rules that make this safe:

1. **Take the money out of the wallet first.** Before calling the bank, a journal moves ₹300 from Bob's wallet to
   payout clearing. Bob cannot spend it twice while the bank works.
2. **Use a stable reference.** The payout request carries our `withdrawal_id` as the bank's reference, so the
   bank can deduplicate and we can ask about it later. On success the bank returns its own reference (in India, the
   **UTR** number), which we save on the withdrawal.
3. **Never re-send on a timeout.** "Unknown" is not "failed". Re-sending could pay Bob twice. Instead, ask the
   bank for the status of that reference, repeatedly with backoff, and if it still cannot tell us, wait for the
   next reconciliation file.
4. **Failure is a new journal, not an undo.** If the bank rejects it, a reversal journal moves ₹300 from payout
   clearing back to Bob's wallet. The history shows both the attempt and the reversal.

This is the same "pending, then check status, never retry the money movement blindly" pattern UPI uses for
transactions that time out.

## 10. Transfers across shards

From section 3, most transfers have Alice on shard A and Bob on shard B. A single database transaction can no
longer cover both. Why is that hard?

**A distributed transaction** must make two machines agree to commit or abort together, even though either can
crash and the network between them can drop or delay messages. The classic protocol, **two-phase commit
(2PC)**, has a coordinator ask both shards "prepare?" (lock the rows, promise to commit), then tell both
"commit". It works, but:

- If the coordinator dies after "prepare", both shards hold their locks and **cannot decide on their own**:
  Alice's and Bob's wallets are frozen until it recovers. 2PC is a *blocking* protocol.
- Every transfer pays extra network round trips and holds locks longer, which hurts exactly when traffic peaks.

There are three practical answers:

| Approach | Idea | Trade-off |
| --- | --- | --- |
| **Distributed SQL database** | Spanner, CockroachDB, YugabyteDB and similar run consensus-replicated, distributed transactions for you | Simplest code; higher write latency and cost; you trust the database's guarantees |
| **Saga with compensation** | Split the transfer into local transactions, each on one shard, recorded in a durable state machine; undo with a compensating transaction if a later step fails for good | No cross-shard locks; money is briefly "in flight" and the code must handle every step being retried |
| **Ledger-first saga (our choice)** | A saga where every step is itself a balanced journal entry through an **in-flight system account** | The books balance at every instant, even mid-transfer |

[![Cross-shard saga: the transfer service records transfer T as created, moves 300 rupees from Alice to the in-flight account on shard A with key T-debit, records debited, moves 300 rupees from the in-flight account to Bob on shard B with key T-credit, retried until it succeeds, and records completed; only if the credit fails for good does it move 300 rupees back from in-flight to Alice with key T-refund and record reversed](/img/system-design/digital-wallet/07-cross-shard.png)](/img/system-design/digital-wallet/07-cross-shard.png)

*Select the diagram to zoom in and move around.*

How the ledger-first saga works:

1. Each shard has an **in-flight** system account. Step 2 is a normal local journal on shard A: Alice −₹300,
   in-flight A +₹300. It checks Alice's balance under her row lock, exactly as in section 7.
2. Step 5 is a local journal on shard B: in-flight B −₹300, Bob +₹300. Crediting never fails for lack of money,
   so this step is simply **retried with the same idempotency key until it succeeds**.
3. When both have happened, in-flight A and in-flight B net to zero. The sum of all in-flight accounts at any
   moment equals the money in transfers that have started but not finished. A monitor alerts on any transfer
   in flight for more than a minute.
4. Compensation (step 8) is only for permanent failures, such as Bob's account being frozen by compliance. It is
   a **new** journal, never a deletion.

The **transfer log** (a table holding each transfer's state) is what makes this crash-safe. A recovery worker
scans for transfers stuck in `CREATED` or `DEBITED` and pushes them forward. Because every step has its own
idempotency key (`T-debit`, `T-credit`, `T-refund`), replaying a step is harmless.

What does Alice see? Her balance drops immediately (step 2), and she is told "sent" once step 2 commits, because
from that point the transfer will complete or be refunded. Bob's balance rises a few milliseconds later. That
brief gap is the price of not locking two shards at once, and it is invisible in practice.

A further optimisation is **co-location**: shard by user so that a user's accounts sit together, and place
frequently paired accounts (a merchant and its settlement accounts) on the same shard.

## 11. Idempotency, event sourcing and audit trails

### Idempotency at every layer

Networks fail in the worst place: after the server did the work but before the reply arrived. The app retries.
Without protection, Bob gets ₹600. **Idempotency** means "doing it twice has the same effect as doing it once".

- **Client to wallet service:** the app's `Idempotency-Key`. The service stores `(user_id, key) → request hash,
  status, response`. A repeat with the same body returns the stored response; a repeat with a **different** body
  is rejected as an error (someone reused a key by mistake).
- **Wallet service to ledger:** the journal's unique `idempotency_key`, derived from the business ID (`T7`,
  `T-debit`). The unique index makes a duplicate insert fail, inside the same transaction as the money movement.
- **Ledger to the world:** events carry the journal ID, so consumers (notifications, statements) skip events they
  have already applied. **At-least-once delivery plus idempotent consumers gives effectively exactly-once.**
- **To banks and gateways:** our reference ID travels with every external call so that the partner can
  deduplicate too.

### The outbox pattern

After committing a transfer we must also publish an event to Kafka. If we commit and then crash before
publishing, the event is lost; if we publish and then the commit fails, we announced a transfer that never
happened. The **transactional outbox** fixes this: write the event into an `outbox_events` table **in the same
transaction** as the postings, and let a separate relay read new outbox rows and publish them, retrying until
Kafka acknowledges. The event is published if and only if the transfer committed (possibly more than once,
which idempotent consumers absorb).

### Event sourcing and audit

**Event sourcing** means storing the sequence of events as the source of truth and deriving the current state by
replaying them. A double-entry ledger already works this way: postings are the events, balances are a
projection. That gives us, almost for free:

- **Time travel:** the balance of any account at any past moment.
- **Rebuildable views:** statements, search indexes and analytics can be rebuilt from postings.
- **An audit trail:** each journal records who or what caused it (user request ID, service, or the operator ID
  for a manual adjustment) and why.

Two more controls are standard in finance. **Manual adjustments** (a support agent crediting a goodwill refund)
need a second person to approve (*maker-checker*), and are themselves journal entries. For tamper evidence, each
day's journals can be hashed into a chain or signed and stored write-once, so a silent edit would be detectable.

## 12. Hot accounts: one merchant, thousands of payments a second

User wallets are quiet: a few writes a day each. Some accounts are not. A large merchant during a sale, a
cashback pool paying millions of users, or the fee revenue account sees **every** payment. Each payment must lock
and update the same `account_balances` row.

How bad is that? Suppose a transaction holds the row lock for about **4 ms** (including the commit and
synchronous replication). One row can then absorb at most $1000 / 4 = 250$ updates per second, no matter how
many servers we add. A merchant receiving 2,000 payments per second would queue, time out and fail.

[![Hot account split: about 2,000 payments per second from many payers go to a router that hashes each payment ID mod N across sub-accounts 0 to N-1, each with its own row and lock; a sweep job every few seconds moves each sub-account's net balance into the shop's main account as one journal, which is used for payouts and display](/img/system-design/digital-wallet/08-hot-account.png)](/img/system-design/digital-wallet/08-hot-account.png)

*Select the diagram to zoom in and move around.*

Techniques, often combined:

- **Sub-accounts (sharding one account).** Give the merchant N sub-accounts, each its own row (and possibly on
  different shards). A payment goes to `hash(payment_id) mod N`. With N = 16 and 250 updates per second each, we
  get about 4,000 per second. The merchant's balance is the sum of the sub-accounts.
- **Sweeping.** A job every few seconds moves each sub-account's balance into the main account in one journal
  per sub-account. Payouts and refunds work from the main account; if it is short, the sweep runs first.
- **Batching.** Instead of one ledger transaction per payment, collect the credits for a hot account over, say,
  50 ms and apply them as one journal with many postings. Throughput rises sharply; each payment waits a little
  longer. This only suits **credits**, which cannot fail for lack of money.
- **Skip the cached balance on the hot side.** For a system account like fee revenue, nobody needs a real-time
  balance; append the postings and compute the balance periodically.

The asymmetry to remember: **credits are easy to spread out; debits need a balance check**. Hot accounts are
almost always receivers, which is lucky.

## 13. KYC tiers, limits, fraud and AML

A wallet is a magnet for fraud and money laundering, so regulators require identity checks and monitoring.

**KYC tiers.** Users start with a quick sign-up (phone number and basic details) and **low limits**; full KYC
(an identity document check, sometimes a video call) unlocks higher limits and bank withdrawals. In India, for
example, the RBI's rules for prepaid payment instruments have allowed minimum-detail wallets only a small balance
(around ₹10,000) with no bank transfers, and full-KYC wallets a much higher cap (around ₹2 lakh). Exact numbers
change, so keep them in configuration, not code.

**Limits** are counters checked before every movement: balance cap, monthly load, daily transfer count and
amount, per-transaction maximum. They live in a fast store keyed by `(user_id, limit, period)`, and are updated
**after** the ledger commits (a failed transfer must not use up the limit).

**Fraud checks** run in two speeds:

- **Synchronous** (a few milliseconds, in the payment path): rules and a model score using velocity ("10
  transfers in a minute"), new device, new recipient, unusual amount, location jumps. Outcomes: allow, block, or
  ask for step-up authentication (PIN, biometric, OTP).
- **Asynchronous** (from the event stream): graph analysis to find **mule accounts** (many small incoming
  transfers, quickly withdrawn), compromised accounts and collusion. Outcomes: freeze an account, hold a
  withdrawal, open a case.

**AML** (*anti-money laundering*) watches for patterns such as **structuring** (many payments just under a
reporting threshold), rapid in-and-out movement and transfers to sanctioned parties. Suspicious cases are
reviewed by a compliance team and, when required, reported to the country's financial intelligence unit. The
system's job is to **flag, hold and record**, not to decide guilt.

## 14. Reconciliation and statements

### Reconciliation: proving our books match the banks

Our ledger is only one version of the truth. The payment gateway, the partner banks and the escrow account each
keep their own records. **Reconciliation** compares them line by line, every day (and intraday for large
amounts), because things do go wrong: lost webhooks, timeouts, bank-side reversals, duplicate settlements.

[![Reconciliation: our ledger export, the payment gateway settlement file and the escrow bank statement go into a normaliser that makes one row per reference; a matcher compares reference, amount and date; matched rows are marked reconciled, disagreements go to a breaks queue with auto-fix rules, and items that cannot be auto-fixed go to finance ops](/img/system-design/digital-wallet/09-reconciliation.png)](/img/system-design/digital-wallet/09-reconciliation.png)

*Select the diagram to zoom in and move around.*

Typical **breaks** (mismatches) and what they mean:

| Break | Likely cause | Fix |
| --- | --- | --- |
| Gateway captured a top-up we never credited | Lost webhook, poller missed it | Credit the wallet now (same idempotency key `T7`, so it is safe) |
| We credited a top-up the gateway does not list | Bug or fraud | Investigate; hold the wallet; post a correcting journal if confirmed |
| Bank shows a payout we marked failed (or the reverse) | Timeout with an unknown outcome | Move the withdrawal to its true state, with a journal |
| Amounts differ | Fee or rounding mismatch | Post the difference to a fee or suspense account; fix the rule |

On top of line-by-line matching, finance checks the **big invariant**: total wallet balances plus clearing
balances equal the escrow account balance. If they differ by even one paisa, someone investigates.

### Statements and history

The ledger primary should not serve "show me my last 20 transactions" millions of times a minute. A
**history read model**, built from the event stream, stores each user's movements denormalised for display
(counterparty name, note, status) and indexed by `(account_id, created_at DESC)`. It lags the ledger by a second
or two, which is fine for a list.

A **monthly statement** is opening balance, every posting and closing balance. Because each posting stores
`balance_after`, the opening and closing balances are lookups. Statements are generated once after the month
closes, stored as files, and never regenerated differently: what the user downloaded in March must be what we can
show an auditor in five years.

## 15. What breaks as it grows

**The hot merchant.** One account becomes the bottleneck on sale day. *Fix:* sub-accounts with sweeping, and
batching of credits (section 12).

**The cross-shard majority.** As shards multiply, nearly every transfer crosses shards. *Fix:* a ledger-first
saga with in-flight accounts and a recovery worker, or a distributed SQL database if the latency budget allows.

**The ever-growing ledger.** Hundreds of terabytes of postings slow down indexes and backups. *Fix:* partition
postings by month, keep recent months on fast storage, move closed months to cheaper storage (still queryable),
and rely on `balance_after` and periodic balance snapshots so old postings are rarely read.

**The retry storm.** A slow bank makes thousands of withdrawals time out; naive retries multiply load and risk
double payouts. *Fix:* status checks instead of re-sends, exponential backoff with jitter, and a circuit
breaker per bank that pauses new payouts and queues them.

**The festival peak.** Traffic jumps 10× for a few hours. *Fix:* pre-scale, shed non-critical work (analytics,
statement generation) via queues, keep the ledger path lean, and load-test the hot-account path specifically.

**Rebalancing shards.** Moving an account to a new shard while it is receiving money is risky. *Fix:* a
directory maps accounts to shards; to move one, briefly freeze its writes, copy, switch the directory and resume,
or simply open new accounts on new shards and leave old ones in place.

## 16. Reliability: how we never lose or invent money

| Risk | Defence |
| --- | --- |
| Primary database dies right after a commit | Synchronous replication to another zone before acknowledging; automatic failover with no data loss |
| A request is processed twice | Idempotency keys at every layer; unique index on `journal_entries.idempotency_key` |
| Crash between two saga steps | Durable transfer log; recovery worker resumes each step with its own idempotency key |
| A bank call times out | Treat as unknown; check status; reconcile; never re-send blindly |
| A bug creates or loses money | Every journal must sum to zero (checked by the ledger service, optionally also by a deferred database check); the global sum and balance verifier run continuously |
| A bad deploy corrupts balances | Postings are append-only, so cached balances can be recomputed from them; point-in-time backups |
| A whole region fails | Ledger replicas in another region; fail over deliberately, accepting a short pause in payments over any risk of two regions both writing |

The principle to remember: **prefer stopping to guessing.** If the ledger is unsure, it declines the payment. A
short outage is recoverable; an inconsistent ledger is a financial incident.

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Balance storage | Only a `balance` column | Double-entry postings + cached balance | **Postings + cache, updated in one transaction**: auditable and fast |
| Money type | Floating point | Integer minor units | **Integers**: exact; floats lose paise |
| Preventing overdraft | Optimistic retries | Row lock / conditional update | **Lock or conditional update**: correct and simple at normal contention |
| Cross-shard transfer | 2PC | Saga | **Ledger-first saga**: no blocking locks; books balance at every step |
| Event publishing | Publish after commit | Transactional outbox | **Outbox**: no lost or phantom events |
| Hot accounts | One row | Sub-accounts + sweep | **Sub-accounts**: spreads lock contention; balance is a sum |
| Withdrawal timeout | Retry the payout | Check status first | **Check status**: retrying could pay twice |
| Under uncertainty | Stay available | Stay correct | **Correct**: decline rather than risk a wrong balance |

## Cheat sheet for last-minute revision

- **A wallet holds money**: the real money sits in a pooled escrow bank account; balances are the company's
  liability to each user. P2P transfers move records, not money.
- **Double-entry ledger:** every journal entry's postings sum to zero; system accounts (top-up clearing, payout
  clearing, fees, in-flight, suspense) make the books close. Global sum is always zero.
- **Money:** `bigint` minor units plus a currency; explicit rounding rules; never floats.
- **Balance:** derived = sum of postings; cached in `account_balances`, updated in the **same transaction**;
  `balance_after` on each posting; verifier job; `CHECK (balance >= 0)`.
- **No negative balance:** `SELECT ... FOR UPDATE` or conditional `UPDATE ... WHERE balance >= amount`; lock
  accounts in ID order to avoid deadlocks.
- **Top-up:** pending record → gateway → credit only on verified webhook or status poll, idempotent on the
  top-up ID.
- **Withdrawal:** hold or move funds first, call the bank with our reference, on timeout check status, never
  re-send; failure = reversal journal.
- **Cross-shard:** 2PC blocks; use a saga of local balanced journals through in-flight accounts, with a durable
  transfer log and per-step idempotency keys.
- **Events:** transactional outbox → Kafka → statements, push, fraud, reconciliation.
- **Hot accounts:** sub-accounts + sweep, batching of credits; credits spread easily, debits need a check.
- **Compliance:** KYC tiers drive limits; fraud checks sync (fast rules + score) and async (graphs, mules); AML
  flags and holds.
- **Reconciliation:** three-way match (ledger, gateway, bank) daily; wallets + clearing = escrow balance.
- **Numbers:** ~90M movements a day, ~1K/s average, ~10K/s peak, ~20 TB of postings a year, ~8 shards; one hot
  row ≈ 250 updates/s.

## Practice questions

1. **A user says their balance is wrong. How do you investigate?** Recompute the balance from postings and
   compare with the cached value. Walk the user's postings with `balance_after` to find where it diverges from
   their expectation, then follow each journal's idempotency key and external reference to the request, the
   gateway or bank record and the reconciliation result.
2. **How would you add cashback ("get ₹50 back on this payment")?** Fund a *promotions* system account from the
   marketing budget. After the payment journal commits, a consumer posts a second journal: promotions −₹50, user
   +₹50, with an idempotency key derived from the payment ID. If cashback is clawed back on refund, post the
   reverse.
3. **How do refunds work when the merchant's balance is already paid out?** The refund journal debits the
   merchant's account. If that would go negative, either debit a merchant **reserve** account kept for this
   purpose or record a receivable (a "merchant owes us" account) and deduct it from the next payout.
4. **How would you support multiple currencies?** One account per currency. A conversion is a journal with four
   postings through an FX account per currency (user USD −10, FX USD +10, FX INR −830, user INR +830), recording
   the rate used. Each currency balances to zero on its own.
5. **How would you let a user split a bill among five friends atomically?** Treat it as one journal with six
   postings if all accounts are on one shard; otherwise a saga that collects each friend's share into an
   in-flight account and pays out only when all shares have arrived, refunding them if it times out.
