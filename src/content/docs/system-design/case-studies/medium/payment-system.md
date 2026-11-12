---
title: "Design a Payment System (like Stripe)"
description: "Design a payment service step by step: the card ecosystem, payment states, idempotency end to end, a double-entry ledger, webhooks, reconciliation and PCI scope."
difficulty: "Medium"
sidebar:
  label: "Payment system (like Stripe)"
tags: ["Payments", "Idempotency", "Ledger", "State machines", "Reliability"]
---

A customer presses **Pay ₹1,500**, a spinner turns for two seconds, and the order is confirmed. Behind that
spinner, at least five companies exchanged messages, money was promised but not yet moved, and our own systems
had to record exactly what happened even if a network cable was cut halfway through. A payment system is
unusual among system design problems: it is not hard because of scale, it is hard because **every mistake costs
real money**. Charging a customer twice, losing track of ₹1 in a million, or paying a seller who was never paid
are all bugs that a support team, an auditor or a regulator will eventually find.

This case study designs the payment service of a large online business: a marketplace that takes card
payments from customers through one or more **payment service providers** (PSPs) and pays its sellers. The same
ideas, one layer down, are what a PSP such as Stripe or Razorpay runs internally. For a contrast with a
bank-to-bank real-time system, see the [UPI case study](/system-design/case-studies/easy/upi/).

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Card payments in 5 minutes: who is involved

A card payment looks like one step, but it passes through a chain of companies, each with one job.

| Who | What they do | Everyday analogy |
| --- | --- | --- |
| **Cardholder** | The customer paying with a debit or credit card | You, writing a cheque |
| **Merchant** | The business selling something (us) | The shop accepting the cheque |
| **PSP / payment gateway** | Gives merchants one simple API for many payment methods, collects card details safely and talks to acquirers | A cheque-collection agency |
| **Acquirer** (acquiring bank) | The merchant's bank for card payments. It receives the money from the card networks and owes it to the merchant | The shop's bank |
| **Card network** (scheme) | Visa, Mastercard, RuPay, Amex. Routes messages between acquirers and issuers and runs the rules | The clearing house between banks |
| **Issuer** (issuing bank) | The cardholder's bank. It approves or declines and later sends the money | The bank the cheque is drawn on |

[![The chain for one card payment: the cardholder gives card details to the merchant, which asks its PSP to charge ₹1,500; the PSP sends an authorisation request to the acquirer, the acquirer routes it by the card's BIN through the card network, and the issuer decides whether to approve and hold the funds](/img/system-design/payment-system/01-ecosystem.png)](/img/system-design/payment-system/01-ecosystem.png)

The network knows which issuer to ask from the card number's first six to eight digits, the **BIN** (bank
identification number). Large PSPs often act as their own acquirer, but the roles stay the same.

Two ideas from this picture shape the whole design:

1. **Approval and money are separate.** In the few seconds of checkout the issuer only *promises* to pay. The
   money itself moves later, in bulk, between banks. Our records must track both.
2. **We control only one link in the chain.** Every other party can be slow, down, or wrong. A payment system is
   mostly a careful way of living with outcomes we do not control.

## 2. The life of a card payment: authorise, capture, settle, refund, chargeback

These five words come up in every payments interview. Learn them precisely.

| Step | What happens | When | Money moves? |
| --- | --- | --- | --- |
| **Authorise** | The issuer checks the card, the balance and fraud signals, then places a **hold** for the amount | At checkout, ~1–3 s | No, the customer's available balance just shrinks |
| **Capture** | The merchant confirms "take the held money", for the full amount or less | Immediately (a "sale") or later, for example when an order ships | Not yet; it is now committed |
| **Settle** | Issuers pay the networks, networks pay acquirers, the acquirer or PSP pays the merchant, minus fees | Usually one to a few business days later, in batches | Yes |
| **Refund** | The merchant sends money back for a captured payment | Any time after capture, merchant-initiated | Yes, in the other direction |
| **Chargeback** | The *cardholder* disputes the payment with their issuer ("I never got it", "not me"). The issuer pulls the money back from the merchant, who can contest it with evidence | Weeks or months later (often up to about 120 days) | Yes, forced and with a fee |

A few more terms:

- **Void (cancel):** releasing an authorisation that was never captured. No money ever moved, so nothing needs
  refunding. Uncaptured holds also **expire** on their own, typically after about a week (the exact window
  depends on the network and card type).
- **Separate authorise and capture** is useful when the final amount is not known yet (a hotel, a cab ride) or
  when goods ship later. A marketplace selling physical goods often authorises at checkout and captures at
  dispatch.
- **3-D Secure (3DS):** an extra step where the issuer asks the cardholder to prove who they are, usually with an
  OTP or a banking-app approval. In India an extra factor like this is required for most domestic online card
  payments. If it is fraud, liability usually shifts to the issuer after a successful 3DS check.
- **Fees:** the issuer earns an **interchange** fee, the network a **scheme fee**, and the acquirer or PSP its own
  margin. Together the merchant sees them as one **merchant discount rate (MDR)**, deducted at settlement.

## 3. Requirements

### Functional (what the system does)

- **Accept payments** for an order by card (and other methods through the PSP), with authorise-and-capture or
  one-step sale.
- **Refunds**, full or partial, and **voids** of uncaptured authorisations.
- **Track disputes** (chargebacks) and their outcomes.
- **Record every money movement in a ledger** that can answer "who owes whom how much" at any moment.
- **Pay out** sellers on a schedule, after commission and fees.
- **Notify** other services (orders, email, analytics) when a payment changes state.
- **Reconcile** daily against PSP settlement files and bank statements.
- **Multiple PSPs**, so one provider's outage or a better price can change the route.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Correctness** | No double charge, no lost payment, ledger always balances | Every bug is a financial loss or a legal problem |
| **Exactly-once effect** | A retry, crash or duplicate message never moves money twice | Networks fail between "sent" and "answered" all the time |
| **Durability** | Never lose a recorded payment or ledger entry; keep them for years | Audits, tax and disputes reach back years |
| **Availability** | 99.99% for taking payments | Every minute down at a sale is lost revenue |
| **Latency** | Our own overhead under ~200 ms; the whole checkout is dominated by the issuer (1–3 s) | Users abandon slow checkouts |
| **Security** | Card numbers never touch our servers; everything encrypted; strict access | PCI DSS compliance, fraud, trust |
| **Auditability** | Every change is traceable: who, when, why, from which request | Regulators and finance teams need to explain every rupee |

### Out of scope

Building an acquirer or card network, running our own card vault, lending, and tax calculation. Mention them,
then set them aside.

## 4. Back-of-the-envelope estimates

**Assumptions:** 10 million payments a day on an ordinary day, and **10×** the average rate at the peak of a
big sale. Each payment creates about 1 payment row, 1.2 attempts, 2 journal entries with 2–3 ledger lines each,
3 webhook events and 1 idempotency record. About **5 KB** per payment across all tables and indexes.

**Traffic**

- Average: $10\text{M} \div 86{,}400 \approx$ **116 payments per second**.
- Peak: about **1,200 per second**. Each payment makes several database writes, so plan for roughly **10,000
  writes per second** at peak, plus webhook traffic.

**Storage**

- $10\text{M} \times 5\text{ KB} = 50\text{ GB}$ a day, about **18 TB a year**.
- Ledger lines: $10\text{M} \times 5 = 50\text{M}$ a day, about **18 billion a year**, kept for 8–10 years.

Three conclusions follow:

1. **Throughput is modest.** A few well-sharded relational databases can carry it. This is not a Netflix-scale
   traffic problem.
2. **Correctness under failure is the real problem.** At 10 million a day, a one-in-a-million network timeout
   happens ten times a day. The rare cases must be designed, not hoped away.
3. **The ledger only grows.** It is append-only and must stay queryable for years, so plan partitioning by time
   and archival from day one.

## 5. Money in code: integers in minor units

Before any API, one rule that interviewers check: **never store money as a floating-point number.** Binary
floats cannot represent 0.1 exactly, so `0.1 + 0.2` gives `0.30000000000000004`. Add that up over a billion
rows and the ledger stops balancing.

- Store amounts as **integers in the currency's minor unit**: ₹1,500.00 is `150000` paise; \$19.99 is `1999`
  cents. Use a 64-bit integer (`bigint`).
- **Always store the currency next to the amount** (`"INR"`, ISO 4217 codes). An amount without a currency is
  meaningless.
- Minor units differ: INR and USD have 2 decimal places, JPY has 0, and a few (KWD, BHD) have 3. Look them up
  from a currency table, never assume 2.
- When splitting (a 10% commission on ₹999.99), decide **who gets the leftover paisa** with an explicit rounding
  rule, and make the parts add up to the whole exactly.

## 6. The API

Clients (our web and mobile checkout, and internal services) call us over HTTPS.

| Method and path | What it does |
| --- | --- |
| `POST /v1/payments` | Create and confirm a payment: `{"order_id": "o_42", "amount": 150000, "currency": "INR", "payment_method": "pm_123", "capture": "automatic"}`, with an `Idempotency-Key` header. |
| `POST /v1/payments/{id}/capture` | Capture an authorised payment, optionally for a smaller `amount`. |
| `POST /v1/payments/{id}/cancel` | Void an uncaptured authorisation. |
| `POST /v1/refunds` | `{"payment_id": "pay_7", "amount": 50000}` with an `Idempotency-Key`. Partial refunds allowed until the total reaches the captured amount. |
| `GET /v1/payments/{id}` | Current state, attempts and refunds. |
| `POST /internal/psp/{psp}/webhooks` | Receives event notifications from each PSP. |
| `POST /internal/payouts` | Run a payout batch for sellers (called by a scheduler). |

Every request that **moves money** carries an `Idempotency-Key`: a random ID (a UUID) the client creates once per
logical action and reuses on every retry. Section 10 shows why that one header carries so much weight.

`payment_method` is a **token** from the PSP, never a card number. Section 15 explains how the card number reaches
the PSP without passing through us.

## 7. High-level design

[![High-level architecture: the checkout page sends a token to the Payments API, which checks auth and the idempotency key and calls the payment service; the payment service asks the fraud check for a risk score, calls the PSP adapter to authorise and capture, and writes state and ledger entries to the payments DB; PSPs send webhooks to a webhook handler that applies events to the DB; the DB's event outbox feeds orders, email and payouts](/img/system-design/payment-system/02-architecture.png)](/img/system-design/payment-system/02-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Checkout page:** shows the PSP's **hosted fields** (card inputs served by the PSP), gets a token, sends it to us.
- **Payments API:** authenticates the caller, validates the request, enforces the idempotency key.
- **Payment service:** owns the **payment state machine** (section 9). Every state change goes through it.
- **Fraud check:** returns a risk score before we send anything to the PSP (section 16).
- **PSP adapter:** one module per PSP that translates our model into that PSP's API, chooses a route, and applies
  timeouts, retries and circuit breakers.
- **Payments DB:** a relational database (for example PostgreSQL or MySQL) holding payments, attempts,
  idempotency keys **and the ledger**, so a state change and its ledger entries commit in **one transaction**.
- **Webhook handler:** receives asynchronous events from PSPs, verifies and de-duplicates them, and applies them
  through the same state machine code.
- **Event outbox:** events written to an `outbox` table in the same transaction, then published to a queue such as
  Kafka for the order service, email and payouts.

Why a relational database here and not a NoSQL store? Payments need **multi-row transactions** (state +
ledger + outbox together), **unique constraints** (idempotency keys, PSP references) and **strong
consistency**. Our traffic fits comfortably in a sharded SQL setup, so we get those guarantees for free.

## 8. Flow: paying for an order

A customer pays ₹1,500 for order 42 with a one-step sale (authorise and capture together).

[![Sequence for one card charge: the checkout page posts the payment with token and key k1; the payment service records a PROCESSING row and the key, sends the charge to the PSP with the attempt ID as idempotency key, the PSP asks the issuer, which approves; the payment service writes CAPTURED and the ledger entries in one transaction and replies 200; a later webhook for the same capture is acknowledged as a no-op](/img/system-design/payment-system/03-pay-flow.png)](/img/system-design/payment-system/03-pay-flow.png)

Things worth noticing:

- **Record first, then call out (step 2 before step 3).** If we crash after calling the PSP but before writing
  anything, we would have charged a card with no record of it. Writing a `PROCESSING` row first means every
  call to the outside world has a row that a recovery job can find later.
- **Never hold a database transaction open across the PSP call.** The call can take seconds; holding locks that
  long would choke the database. Step 2 and step 7 are two short transactions.
- **Our attempt ID is the PSP's idempotency key.** If we retry step 3, the PSP sees the same key and returns the
  original result instead of charging again.
- **Step 7 is one transaction:** new state, ledger entries and an outbox event commit together, or not at all.
- **The webhook in step 9 usually tells us what we already know.** It is still essential, because when step 6 is
  lost (a timeout), the webhook is how we find out.

## 9. Deep dive: the payment state machine

A payment is not a boolean "paid / not paid". It moves through well-defined **states**, and only certain moves
are legal. Writing that down as a state machine is the single best defence against bugs like refunding a payment
that was never captured.

[![Payment state machine: Created to Processing on confirm, Processing to Authorised when approved, Authorised to Captured on capture, Captured to Refunded on refund; Processing can go to Requires action for 3DS and back, to Failed when declined, or to Unknown on a timeout, which a query resolves to Authorised or Failed; Authorised can be Cancelled by a void or expiry; Captured can become Disputed by a chargeback](/img/system-design/payment-system/04-states.png)](/img/system-design/payment-system/04-states.png)

*Select the diagram to zoom in and move around.*

Rules that make it safe:

- **Transitions are checked in the database**, not just in code, using a conditional update with a version
  number so two workers cannot both move the same payment:

  ```sql
  UPDATE payments
     SET status = 'CAPTURED', version = version + 1
   WHERE id = 7 AND status = 'AUTHORISED' AND version = 3;
  -- 0 rows updated means someone else got there first: re-read and decide.
  ```

- **States only move forward.** A late event saying "authorised" for a payment that is already `CAPTURED` is
  ignored. This is what makes out-of-order webhooks harmless (section 13).
- **`Unknown` is a real state.** A timeout is not a failure; we genuinely do not know. Section 12 is about it.
- **Refunds and disputes are their own objects** with their own small state machines (`pending → succeeded /
  failed`), linked to the payment. A payment can have several partial refunds; the diagram shows only the
  fully refunded end state. A dispute can also be won by the merchant, which returns the money.
- **Every transition is appended to a history table** (`payment_events`), so support can see exactly what
  happened and when.

## 10. Deep dive: idempotency end to end

**Idempotent** means "doing it twice has the same effect as doing it once". Pressing a lift button five times
still calls one lift. Payments need this at **every hop**, because every hop can fail after the work is done but
before the reply arrives.

| Hop | Duplicate comes from | Defence |
| --- | --- | --- |
| Customer → our API | Double click, app retry after a dropped reply | Client sends one `Idempotency-Key` per checkout and reuses it on retry |
| Our API → database | Two retries racing each other | Unique constraint on `(merchant_id, key)`; the loser reads the winner's row |
| Payment service → PSP | Our retry after a timeout | Pass our attempt ID as the PSP's idempotency key |
| PSP → our webhook | PSP retries until it gets a `2xx` | Unique `psp_event_id`; a duplicate insert is a no-op |
| Our service → ledger | A job re-running after a crash | Unique `(payment_id, kind)` on journal entries, so "capture" is posted once |
| Our service → queue consumers | Kafka redelivers after a rebalance | Consumers de-duplicate by event ID |

How the API handles a key, step by step:

1. Look up `(merchant_id, key)`. If it does not exist, **insert it** with status `in_progress` and a hash of the
   request body, in the same transaction that creates the payment.
2. If it exists and is **complete**, return the stored response. The client cannot tell the retry from the
   original.
3. If it exists and is **in progress** (the first request is still running), return `409 Conflict` so the client
   waits and retries.
4. If it exists but the **request body hash differs**, return `422`: the client reused a key for a different
   payment, which is a bug on their side.
5. Keys expire after a while (for example 24 hours or a few days), long after any sane retry.

Put together, the rule to remember is: **at-least-once delivery + idempotent processing = exactly-once effect.**
We cannot stop messages from being sent twice, but we can make the second one harmless.

## 11. Deep dive: the double-entry ledger

### Why a ledger?

A tempting design is a `balance` column per seller that we add to and subtract from. It fails quickly: when the
number is wrong, there is no way to know *why*, and a bug that updates it twice leaves no trace. Accountants
solved this 500 years ago with **double-entry bookkeeping**, and every serious payment system uses it.

- Money is tracked in **accounts**: what the PSP owes us, what we owe each seller, our revenue, our fees.
- Every movement is a **journal entry** made of **lines**. Each line **debits** or **credits** one account.
- **In every entry, total debits equal total credits.** Money is never created or destroyed, only moved.
- Entries are **immutable**. A mistake is fixed by a new reversing entry, never by editing or deleting.
- A balance is never stored as the truth. It is **the sum of an account's lines** (cached for speed, but always
  recomputable).

Debit and credit are just the two sides, not "good" and "bad". By convention, a **debit increases an asset**
(something we own or are owed) and a **credit increases a liability or revenue** (something we owe or earned).

### A worked example

A customer pays ₹1,500 for a seller's item. We keep 10% commission (₹150). The PSP charges 2% (₹30). Amounts
are in paise.

**1. Capture succeeds.** The PSP now owes us the full amount; we owe the seller their share.

| Account | Type | Debit | Credit |
| --- | --- | --- | --- |
| PSP receivable | Asset | 150000 | |
| Seller payable (seller 9) | Liability | | 135000 |
| Commission revenue | Revenue | | 15000 |
| **Total** | | **150000** | **150000** |

**2. The PSP settles two days later**, paying ₹1,470 into our bank and keeping its fee.

| Account | Type | Debit | Credit |
| --- | --- | --- | --- |
| Bank (cash) | Asset | 147000 | |
| PSP fees | Expense | 3000 | |
| PSP receivable | Asset | | 150000 |
| **Total** | | **150000** | **150000** |

**3. We pay the seller** in the weekly payout.

| Account | Type | Debit | Credit |
| --- | --- | --- | --- |
| Seller payable (seller 9) | Liability | 135000 | |
| Bank (cash) | Asset | | 135000 |

After all three, PSP receivable and seller payable are back to zero (everyone has been paid), the bank holds
₹120 more, and that ₹120 is exactly our ₹150 commission minus the ₹30 fee. If any of these numbers do not add up,
the ledger tells us immediately, and the journal entries tell us where.

A refund before payout is simply another entry the other way: debit seller payable 135000, debit commission
revenue 15000, credit PSP receivable 150000. Nothing is edited.

### The data model

[![Data model: merchants own payments; a payment has payment attempts, idempotency keys and webhook events; a payment posts journal entries, each with ledger lines, and each ledger line belongs to a ledger account](/img/system-design/payment-system/05-data-model.png)](/img/system-design/payment-system/05-data-model.png)

*Select the diagram to zoom in and move around.*

Decisions hidden in this diagram:

- **`payments` vs `payment_attempts`.** One payment may need several tries (a decline, then a second card, or a
  failover to another PSP). The payment is what the customer sees; the attempts are what we sent to PSPs.
- **`psp_ref` is unique.** It is the PSP's ID for an attempt and the join key for reconciliation.
- **`ledger_lines.direction` is `D` or `C` and `amount_minor` is always positive.** A database check (or a
  trigger at commit) enforces that each journal entry's debits equal its credits.
- **`ledger_accounts.currency`.** An account holds one currency only, so we never add rupees to dollars.
- **Sharding.** Payments and their attempts, keys and events are sharded by `merchant_id` (or by payment ID for a
  single merchant with huge volume). Ledger lines are partitioned by time, because they are written once and
  later read in date ranges for reports and audits.

## 12. Deep dive: timeouts and unknown outcomes

The hardest moment in payments: we sent "charge ₹1,500" to the PSP and got **no answer** (a timeout, a reset
connection, a `502`). The card may or may not have been charged. Both obvious reactions are wrong:

- **Marking it failed** risks taking the customer's money while telling them it failed. They pay again, and now
  they are charged twice.
- **Retrying with a fresh request** risks charging twice too.

[![Handling a timeout: mark the payment UNKNOWN, never failed; query the PSP by idempotency key or reference; if the PSP knows it, apply its answer; if not and it is safe to retry, retry with the same idempotency key with backoff and check again; when out of tries, a webhook or reconciliation settles the outcome](/img/system-design/payment-system/06-unknown-outcome.png)](/img/system-design/payment-system/06-unknown-outcome.png)

*Select the diagram to zoom in and move around.*

The decision is **retry vs query vs reconcile**:

1. **Mark the attempt `UNKNOWN`** and tell the customer "we're confirming your payment", not "failed".
2. **Query** the PSP for our reference. If it has a final answer, apply it. This is the common case.
3. If the PSP has **no record**, the request never arrived. **Retry with the same idempotency key**, which is safe
   by construction: if the first request did land in the meantime, the PSP returns its result instead of charging
   again.
4. Retries use **exponential backoff with jitter**: wait about 1 s, 2 s, 4 s, 8 s… plus a random amount, up to a
   cap, so thousands of failed requests do not all retry at the same instant and knock the PSP over again.
5. If we run out of tries, a background job keeps checking, the PSP's **webhook** will usually arrive, and the
   nightly **reconciliation** (section 14) is the final safety net.

Which errors are retryable? Network errors, timeouts, `5xx` and `429` (rate limited): yes, with the same key.
A **decline** (insufficient funds, card blocked) is a final answer from the issuer: no automatic retry. Card
networks also restrict repeated retries of declined cards, so retrying declines can cost fees and reputation.

If a customer was charged but our order was cancelled because we gave up, the fix is automatic: when the late
success arrives, either complete the order or **refund automatically**. Never leave money taken with nothing in
return.

## 13. Deep dive: webhooks from PSPs

A **webhook** is the PSP calling *us*: an HTTPS `POST` to our endpoint saying "payment `pi_88` was captured" or
"a dispute was opened". It is how we learn about anything that happens after our request returns: late
results, 3DS completion, refunds, chargebacks, settlements.

Webhooks have three uncomfortable properties: they can arrive **more than once** (the PSP retries until it gets a
`2xx`, often for hours or days), **out of order** (`refund.succeeded` before `payment.captured`), and from
**anyone** who discovers the URL.

[![Receiving webhooks: the PSP posts signed event evt_9; the endpoint checks the signature, inserts the event into webhook_events and replies 200 at once; an event worker picks up unprocessed events, fetches the payment's latest state from the PSP and applies only forward transitions through the payment service; when the PSP retries evt_9, the insert finds it already exists and the endpoint replies 200 with nothing to do](/img/system-design/payment-system/07-webhooks.png)](/img/system-design/payment-system/07-webhooks.png)

*Select the diagram to zoom in and move around.*

How to handle them:

- **Verify the signature.** PSPs sign each webhook (typically an HMAC of the body with a shared secret, plus a
  timestamp to stop replays). Reject anything unsigned or stale.
- **Store, acknowledge, then process.** Insert the raw event into `webhook_events` and return `200` within
  milliseconds. Slow processing inside the request causes PSP timeouts and needless retries.
- **De-duplicate by event ID.** The primary key on `psp_event_id` turns a duplicate into a no-op.
- **Don't trust the order.** Either fetch the latest state of the object from the PSP before acting, or rely on
  the state machine: a move backwards ("authorised" after "captured") is simply ignored.
- **Treat webhooks as hints, polling as a backup.** Webhooks can be lost when our endpoint is down for longer than
  the PSP retries. A job that queries any payment stuck in `PROCESSING` or `UNKNOWN` for too long closes the gap.

## 14. Deep dive: reconciliation with settlement files

Even with idempotency and webhooks, our records and reality can drift: a bug, a PSP-side correction, a refund
done by hand in the PSP's dashboard. **Reconciliation** is the daily check that our ledger agrees with the
outside world, and it is how finance teams sleep at night.

Every day each PSP publishes a **settlement report** (a file or API listing every captured payment, refund,
chargeback and fee in that payout), and the bank statement shows the money that actually arrived.

[![Daily reconciliation: our ledger export, the PSP settlement file and the bank statement's payout lines are normalised into one row per psp_ref, matched, and sorted into matched items (post fees, mark settled), breaks such as missing items or amount differences, and an ops queue for breaks that cannot be fixed automatically](/img/system-design/payment-system/08-reconciliation.png)](/img/system-design/payment-system/08-reconciliation.png)

*Select the diagram to zoom in and move around.*

The matcher joins on `psp_ref` and sorts every row into a bucket:

| Result | Typical cause | Action |
| --- | --- | --- |
| **Matched** | Everything agrees | Post the settlement entry (fees, bank cash), mark settled |
| **In PSP, not in our ledger** | We timed out and never learned it succeeded | Fetch it, apply the transition, complete the order or refund |
| **In our ledger, not in PSP** | Payment captured late, or the PSP missed it | Wait a day (timing), then raise with the PSP |
| **Amount differs** | Partial capture, fee change, currency conversion | Auto-fix known patterns; otherwise ops review |
| **Payout total ≠ bank credit** | Reserve withheld, bank delay | Ops review with the PSP |

Reconciliation runs as a batch job over a day's data. The goal is that the ops queue is small enough for a person
to clear daily, and every recurring break type becomes an automatic rule.

## 15. Deep dive: PCI DSS and tokenisation

**PCI DSS** (Payment Card Industry Data Security Standard) is the set of security rules for anyone who stores,
processes or transmits card numbers. Its scope is everything that **touches card data**, and complying for a
large scope means audits, network segmentation, key management and quarterly scans. The best strategy is to
**keep card numbers out of our systems entirely**.

[![Hosted fields: our checkout page embeds a card field served from the PSP's domain; the customer types the card into that iframe, which sends it directly to the PSP vault and gets back token pm_123; our page sends the token to our server, which charges pm_123 for 150000 paise without ever seeing the card number](/img/system-design/payment-system/09-tokenisation.png)](/img/system-design/payment-system/09-tokenisation.png)

*Select the diagram to zoom in and move around.*

- **Hosted fields** (an iframe from the PSP inside our page) or a **hosted payment page** (a redirect to the PSP)
  mean the card number goes from the customer's browser straight to the PSP. Because the iframe comes from
  another domain, our page's JavaScript cannot read it.
- The PSP returns a **token** (`pm_123`): a meaningless reference that only works with our PSP account. A stolen
  token is far less useful than a stolen card number.
- Our PCI scope shrinks from the full standard to the smallest self-assessment questionnaire (**SAQ A** for
  fully outsourced card entry). We must still protect the checkout page that hosts the iframe, because a
  malicious script there could fake the form.
- **Never store the CVC** anywhere, ever, even encrypted; the rules forbid keeping it after authorisation.
- **Saved cards** are tokens too. In India, since October 2022 merchants may not store card numbers at all, and
  saved cards use **network tokens** issued through the card networks.

## 16. Payouts, multi-currency and fraud

### Payouts

Sellers are paid on a schedule (daily or weekly) from their **seller payable** balance.

- A payout job computes each seller's **available** balance from the ledger: settled sales, minus refunds, minus
  a **reserve** held back for future chargebacks (a new seller might have 10% held for 30 days).
- It creates a `payout` record and a ledger entry (seller payable → "payout in transit") **before** calling the
  bank's payout API, with the payout ID as the idempotency key. The same unknown-outcome rules as section 12
  apply; the bank statement confirms it.
- Payouts need verified seller identity (KYC) and bank details, and are blocked if a seller's balance goes
  negative after chargebacks.

### Multi-currency

- The customer pays in the **presentment currency** (what they see, say USD); we may be paid out in a different
  **settlement currency** (INR). Store both amounts and currencies on the payment; never mix them in one number.
- If we convert, show the customer a rate **locked for a short time** (a quote with an expiry), and record the
  conversion in the ledger as two entries in two currencies through an **FX account**, so each currency balances
  on its own.
- Rounding follows each currency's minor units (section 5).

### Fraud checks

Fraud is checked **before** sending a payment to the PSP, because a fraudulent capture costs the amount, a
chargeback fee and network penalties.

- **Signals:** how many payments from this card, device or IP in the last hour (velocity), card country vs IP
  country, a brand-new account placing a large order, a device fingerprint linked to past chargebacks.
- **Rules plus a machine-learning score** produce one of: **allow**, **challenge** (force 3DS), **review** (hold for
  a human) or **block**.
- The trade-off is false positives: every good customer blocked is lost revenue. Outcomes (chargebacks, confirmed
  fraud) feed back as training labels. Card networks also monitor merchants whose dispute rate gets too high.

## 17. What breaks as it grows, and how to fix it

**The hot ledger account.** Every payment credits "commission revenue" and debits "PSP receivable". If each
entry updates one cached balance row, every payment queues for the same row lock. *Fix:* don't update a balance
row per entry; compute balances from lines with periodic snapshots, or split a hot account into several
sub-accounts (receivable-shard-0…15) that are summed for reports.

**One PSP goes down.** At a sale, a PSP outage stops all revenue. *Fix:* integrate two or more PSPs, route by
health, cost and success rate, and use a **circuit breaker** in the adapter that stops sending to a PSP whose
error rate spikes. Saved cards must then be stored as network tokens or in a vault usable by both PSPs.

**Sale-day spikes.** Traffic jumps 10× in minutes. *Fix:* keep the synchronous path short (record, call PSP,
record), push everything else (emails, analytics, seller notifications) through the outbox and queue, and scale
the stateless services ahead of known sales.

**The stuck-payments pile.** Thousands of `UNKNOWN` or `PROCESSING` payments after a PSP incident. *Fix:* a
sweeper job that queries them in priority order with rate limits, plus reconciliation, with dashboards for "age
of oldest unresolved payment".

**The growing ledger.** Billions of lines a year. *Fix:* partition by month, keep recent months on fast storage,
move old partitions to cheaper storage, and keep a daily balance snapshot per account so reports never scan
years of lines.

**Webhook floods.** A PSP replays a day of events after its own incident. *Fix:* the endpoint only stores and
acknowledges; workers drain the table at their own pace, and de-duplication makes the replays free.

## 18. Reliability: how we never lose or duplicate money

| Risk | Defence |
| --- | --- |
| Customer charged twice after a retry | Idempotency key per checkout; same attempt ID sent to the PSP |
| Crash between charging and recording | `PROCESSING` row written before the PSP call; sweeper and reconciliation find it |
| Timeout with unknown outcome | `UNKNOWN` state; query, then retry with the same key; never assume failure |
| Duplicate or out-of-order webhooks | Unique event ID; forward-only state machine; re-fetch the latest state |
| State saved but event not published | Transactional outbox: the event row commits with the state change |
| Ledger silently wrong | Debits = credits enforced per entry; immutable lines; daily reconciliation |
| Data centre failure | Synchronous replication of the payments DB to another zone; no acknowledged write is lost on failover |
| A bad deploy | Immutable ledger means nothing is overwritten; fixes are new, reviewed entries |

## 19. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Database | NoSQL, horizontally scaled | Relational, sharded | **Relational**: transactions and unique constraints matter more than raw throughput |
| Balances | Mutable balance column | Sum of immutable ledger lines | **Ledger**: auditable and self-checking; cache balances as snapshots |
| On timeout | Mark failed, let the user retry | Mark unknown, query and reconcile | **Unknown**: avoids double charges and false failures |
| Ledger location | Same DB as payments | Separate ledger service | **Same DB at first** for one-transaction writes; split later behind an outbox when scale or teams demand it |
| Card entry | Our own form | PSP hosted fields | **Hosted fields**: tiny PCI scope |
| Capture | Immediate sale | Authorise now, capture at shipping | **Depends on the business**: auth-then-capture for physical goods, sale for digital |
| PSPs | One PSP | Several with routing | **Several** once volume justifies it: availability and cost, at the price of more reconciliation |

## Cheat sheet for last-minute revision

- **Players:** cardholder → merchant → PSP → acquirer → card network → issuer. The issuer approves; money moves
  later at settlement.
- **Five verbs:** authorise (hold), capture (commit), settle (money moves, minus fees), refund (merchant sends
  back), chargeback (cardholder forces it back). Void cancels an uncaptured hold.
- **Money:** 64-bit integers in minor units plus an ISO currency code. Never floats.
- **State machine:** created → processing → authorised → captured → refunded, with requires-action, unknown,
  failed, cancelled and disputed. Forward-only, enforced with conditional updates.
- **Idempotency at every hop:** client key → unique constraint → same key to the PSP → unique webhook event ID →
  unique journal entry per payment and kind.
- **At-least-once + idempotent = exactly-once effect.**
- **Record first, call out, record result.** Never a DB transaction across a network call.
- **Timeouts:** mark unknown, query, retry with the same key and backoff with jitter, reconcile. Never assume failure.
- **Ledger:** double entry, debits = credits, immutable, balances are sums. Fix mistakes with reversing entries.
- **Webhooks:** verify signature, store, `200` fast, de-duplicate, don't trust order, poll as backup.
- **Reconciliation:** ledger vs PSP settlement file vs bank statement, matched on `psp_ref`, breaks to auto-fix or ops.
- **PCI:** hosted fields and tokens keep card numbers off our servers; never store CVC.
- **Numbers:** 10M payments a day ≈ 116/s average, ~1,200/s at a sale peak, ~50 GB a day, ledger grows ~18B
  lines a year.

## Practice questions

1. **A customer says they were charged twice. How do you investigate?** Find both charges at the PSP by
   `psp_ref`, then our attempts and idempotency keys. Two attempts with different keys means the client did not
   reuse its key (a client bug) or a second checkout happened; one key with two PSP charges means we did not pass
   our idempotency key to the PSP. Refund the duplicate, then fix the root cause.
2. **How would you handle a partial capture, for example one item out of stock?** Capture the smaller amount; the
   rest of the hold is released by the issuer. The ledger records only the captured amount.
3. **The PSP's settlement file says ₹1,470 but our ledger expects ₹1,500. Why?** Most likely the PSP fee was
   deducted. Post a fee entry from the file's fee column; if the fee does not match the contract, flag it for ops.
4. **How do you add a second PSP without breaking idempotency?** Each attempt belongs to exactly one PSP and
   carries its own attempt ID as the key. Only after the first PSP gives a final failure (not an unknown) may a new
   attempt go to the second PSP, otherwise the customer could be charged by both.
5. **How would subscriptions (monthly billing) fit in?** A scheduler creates a payment per billing cycle with an
   idempotency key derived from `(subscription_id, period)`, charges a saved token without the customer present,
   and retries soft declines on a schedule over several days before cancelling.
6. **How is this different from UPI?** UPI is a push payment from bank account to bank account through one switch,
   usually with no separate authorise-and-capture step, and disputes follow UPI's own process rather than card chargebacks; final status usually arrives within
   seconds. The same ideas still apply: unique transaction IDs, pending states and reconciliation. See the
   [UPI case study](/system-design/case-studies/easy/upi/).
