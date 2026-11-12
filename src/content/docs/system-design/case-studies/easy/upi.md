---
title: "Design a Unified Payments Interface (UPI)"
description: "How India's UPI moves money in seconds: PSP apps, banks and the NPCI switch, UPI IDs, PIN security, pay and collect flows, pending transactions and exactly-once payments."
difficulty: "Easy"
sidebar:
  label: "UPI (India's real-time payments)"
tags: ["Payments", "Idempotency", "State machines", "Reliability", "Security"]
---

You scan a QR code at a tea stall, type a four-digit PIN, and before you have put your phone away the shopkeeper's
speaker says "₹20 received". No card, no bank details, no waiting. That is **UPI**, the Unified Payments Interface:
India's real-time payment system, run by the **National Payments Corporation of India (NPCI)** under the rules of
the Reserve Bank of India (RBI). Since its launch in 2016 it has grown into one of the busiest payment systems in the
world: in 2025 it crossed **20 billion transactions a month**, with record days of around **750 million**.

UPI is a wonderful interview topic because it is not one company's system. It is a **network**: hundreds of banks
and dozens of apps that do not trust each other's servers, joined by a central switch, all moving real money. The
hard questions are the ones every payment system faces: what happens when a reply never arrives, how you make sure
money moves **exactly once**, and how you stay up when one of hundreds of partners is down.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: sections 1 to 4 explain how the real UPI works, and the rest
designs it (a PSP app's backend and the central switch) the way an interviewer would ask.
:::

## 1. UPI in 5 minutes: who is involved

Before UPI, sending money to a friend meant knowing their account number and IFSC (the code of their bank branch),
adding them as a "beneficiary", and waiting. UPI hides all of that behind a short address like `bob@psp2` and makes
every bank talk to every other bank through **one** central hub.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **NPCI** | The not-for-profit body, set up by banks under RBI guidance, that runs UPI and other Indian payment networks | The organisation that runs the national highway |
| **UPI switch** | NPCI's central system. Every UPI message passes through it; it routes requests and orchestrates the debit and the credit | The central telephone exchange |
| **PSP** (payment service provider) | A bank that is allowed to offer UPI to customers, and the app that sits on it | The shop counter where you hand in a money order |
| **TPAP** (third-party app provider) | A non-bank app (Google Pay, PhonePe and others) that offers UPI through one or more **sponsor banks** that act as its PSP | A franchise counter operating under a licensed bank's name |
| **Remitter bank** | The bank that holds the **payer's** account and is debited | Your bank |
| **Beneficiary bank** | The bank that holds the **payee's** account and is credited | Your friend's bank |
| **VPA / UPI ID** | A virtual payment address such as `alice@psp1`. The part after `@` (the **handle**) says which PSP knows the account behind it | An email address for money |
| **UPI PIN** | A 4 or 6 digit secret, set per bank account and checked by the remitter bank | The signature on a cheque |
| **Txn ID and RRN** | A unique ID for each transaction, created by the PSP that starts it, plus a 12-digit reference number shown on receipts | A courier tracking number |

The single most important fact: **the app never holds your money**. The money sits in your bank account. The app is
a remote control; the PSP and NPCI pass instructions; the banks move the money.

[![The UPI ecosystem: Alice gives her app a payment and PIN, the payer PSP sends a pay request to the NPCI UPI switch, the switch asks the payee PSP to resolve bob@psp2, debits Alice at the remitter bank, credits Bob at the beneficiary bank, and the payee PSP notifies Bob](/img/system-design/upi/01-ecosystem.png)](/img/system-design/upi/01-ecosystem.png)

*Select the diagram to zoom in and move around.*

Three ideas from this picture shape everything else:

1. **Hub and spoke.** Each bank and PSP connects **once**, to NPCI, instead of to every other bank. With $n$
   members, that is $n$ connections instead of about $n^2/2$.
2. **The switch orchestrates, the banks own the money.** NPCI tells the remitter bank to debit and the beneficiary
   bank to credit, in that order. It never holds a customer's balance.
3. **Addresses are resolved, not stored centrally.** NPCI only knows which PSP owns each handle. The PSP that owns
   `@psp2` knows which account `bob@psp2` points to.

## 2. Getting ready to pay: device binding, accounts and the PIN

Paying must be quick, but it also has to be safe on a phone that could be lost or stolen. UPI uses **two factors**:
something you **have** (this phone, with this SIM) and something you **know** (the UPI PIN).

[![Onboarding sequence: the app sends an encrypted SMS from the SIM so the PSP binds device, SIM and mobile number; the PSP asks NPCI to list accounts for that mobile number and the bank returns masked accounts; Alice enters card digits, an OTP and a new PIN into the NPCI common library, which encrypts them so the PSP cannot read the PIN, and the bank stores the PIN](/img/system-design/upi/02-onboarding.png)](/img/system-design/upi/02-onboarding.png)

*Select the diagram to zoom in and move around.*

- **Device binding (what you have).** The app sends an encrypted SMS **from the phone's SIM** to the PSP. Because
  the operator delivered it from that number, the PSP learns that this device really holds this SIM, and binds the
  device, the SIM and the mobile number together. If you swap the SIM or move to a new phone, binding starts again.
- **Finding accounts.** Banks know their customers' registered mobile numbers. The PSP asks NPCI to list the accounts
  linked to the verified number; each bank answers with masked account numbers (`XXXX1234`) and you pick one.
- **Setting the PIN (what you know).** You prove you own the account (typically the last six digits and expiry of
  the debit card plus an OTP from the bank, or an Aadhaar-based OTP), then choose a PIN.
- **The PIN is typed into NPCI's common library, not the app.** The **common library** (CL) is a component that NPCI
  supplies and every PSP app embeds. It draws the PIN screen, encrypts the PIN inside the phone and hands the app only
  an encrypted blob. The PSP forwards that blob but **cannot read it**; only the remitter bank's side can check it.
  So a buggy or malicious app cannot leak PINs, and the PSP's servers are not a store of every user's secret.

Your VPA (`alice@psp1`) is then created at the PSP and linked to the chosen account. You can have several VPAs and
several linked accounts; each payment says which account to use.

## 3. The two ways to move money: pay and collect

### Push: "pay" (the payer starts it)

This is the common case: Alice pays `bob@psp2` ₹500, by typing his UPI ID or scanning his QR code.

[![Push payment sequence: Alice's app sends the pay request with the encrypted PIN to the payer PSP, which assigns a txn ID and sends it to NPCI; NPCI asks the payee PSP who bob@psp2 is and gets the account and IFSC; NPCI asks the remitter bank to debit 500 rupees with the PIN, then the beneficiary bank to credit it; NPCI returns success to the payer PSP, sends a confirmation to the payee PSP, and Alice sees 500 rupees sent](/img/system-design/upi/03-pay.png)](/img/system-design/upi/03-pay.png)

*Select the diagram to zoom in and move around.*

Step by step:

1. Alice enters the amount and her PIN (in the common library). The **payer PSP** checks the device binding and its
   own limits, and assigns a **unique transaction ID**.
2. The payer PSP sends a **pay request** to NPCI. (In the UPI specification, messages have names like `ReqPay` and
   `RespPay`; you do not need the exact fields in an interview.)
3. NPCI looks at the handle `@psp2`, finds which PSP owns it, and asks that **payee PSP** to resolve `bob@psp2`.
4. The payee PSP answers with Bob's account number and IFSC. If the address does not exist, the payment stops here,
   **before** any money moves.
5. NPCI asks the **remitter bank** to debit Alice ₹500, passing the encrypted PIN. The bank checks the PIN, the
   account's status, its limits and the balance, then debits.
6. Only after a successful debit does NPCI ask the **beneficiary bank** to credit Bob.
7. NPCI tells the payer PSP "success" and sends a confirmation to the payee PSP; both apps notify their users.

Before step 1, apps usually **validate the address** first and show the payee's registered name ("Bob Kumar"), so
Alice can spot a typo or a fake ID before she enters her PIN.

Notice the order: **debit first, then credit**. If the debit fails, nothing has happened and the payment simply
fails. If the debit succeeds and the credit fails, Alice's money must be returned (a **reversal**). The reverse
order would be far worse: crediting Bob and then failing to debit Alice would create money out of nothing.

### Pull: "collect" (the payee starts it)

A **collect request** lets the payee ask for money: an online shop sends "pay ₹500 to Shop" to `alice@psp1`, and
Alice approves it in her app.

[![Collect request sequence: the shop's PSP sends a collect request for alice@psp1 to NPCI with a txn ID and an expiry; NPCI passes it to Alice's PSP, which asks Alice to approve; Alice approves with her encrypted PIN; NPCI then debits the remitter bank, credits the beneficiary bank, returns success to the shop's PSP and sends a confirmation to Alice's PSP](/img/system-design/upi/04-collect.png)](/img/system-design/upi/04-collect.png)

*Select the diagram to zoom in and move around.*

The money still moves **debit first, then credit**; what changes is who starts and who waits. The request has an
**expiry**, and Alice can decline it. Collect requests were also a favourite tool of fraudsters ("approve this to
**receive** your refund"), because the screen asks the victim for their PIN. NPCI first capped person-to-person collect
requests at ₹2,000 and then, from **1 October 2025**, stopped person-to-person collect altogether; collect requests
from verified merchants continue. This is a good example to raise in an interview: a design decision reversed for
**safety**, not for technology.

### QR codes

A UPI QR code is simply a **link** printed as a picture, in a standard format, for example:

```text
upi://pay?pa=shop@psp2&pn=Tea%20Stall&am=20.00&cu=INR&tr=ORDER123
```

`pa` is the payee address, `pn` the payee name, `am` the amount, `cu` the currency and `tr` the merchant's
reference. Scanning it just fills in a **push** payment for you. A **static** QR (printed on a stand) carries only
the address, and you type the amount. A **dynamic** QR (shown on a billing screen) carries the amount and an order
reference, so the shop's system can match the payment to the bill automatically. Because a QR only ever starts a
payment **from** you, scanning a QR to **receive** money is always a scam.

## 4. When replies do not arrive: pending, reversals and reconciliation

On a happy day, the whole flow takes a couple of seconds. But a payment touches four or five organisations over
networks, and any of them can be slow. The scariest moment in payments is not a "no". It is **silence**.

Suppose NPCI asked the remitter bank to debit and the reply never came. Did the debit happen? Nobody knows yet. The
payment cannot be called a success (Bob may not have the money) or a failure (Alice may have lost it). So it is
**pending**: the app shows "Payment pending, we will update you", and the system goes looking for the truth.

[![Transaction states: Initiated moves to Debited on a successful debit and to Success when the credit succeeds; wrong PIN or no funds leads to Failed; a debit or credit timeout leads to Pending; a declined credit leads to Reversed; from Pending, a status check leads to Success if credited, Reversed if not credited, or Failed if never debited](/img/system-design/upi/05-states.png)](/img/system-design/upi/05-states.png)

How the truth is found:

- **Check status, never re-pay.** The PSP asks NPCI for the status of **the same transaction ID**. It must never send
  a fresh payment with a new ID "just in case": that is how people get charged twice. NPCI's 2025 rules say the first
  check should come about **90 seconds** after the transaction and that there should be at most **three** checks,
  preferably within two hours, because floods of status checks from many apps once helped overload the network.
- **Deemed transactions.** Sometimes the debit succeeded and the beneficiary bank did not answer the credit in time.
  UPI calls these **deemed** transactions: the beneficiary bank has to settle the matter with its customer later
  (credit Bob, or return the money).
- **Reversals.** If Alice was debited but Bob was never credited, the money is returned to Alice. RBI's rules on
  turnaround time require a failed UPI transfer to be reversed by **T+1** (one day after the transaction day), and the
  bank must pay the customer compensation of ₹100 per day of delay beyond that.
- **Reconciliation.** Every day, each bank and PSP compares its own records against NPCI's reports and its bank
  statements (see section 11). Anything still pending is settled from these files.

[![Resolving a pending transaction: after no final reply the app shows Pending, waits about 90 seconds and checks status with the same txn ID; with a final answer it updates and notifies; otherwise it checks again while about three checks in two hours remain, then daily reconciliation either finds it credited or triggers an auto-reversal by T+1](/img/system-design/upi/06-pending.png)](/img/system-design/upi/06-pending.png)

*Select the diagram to zoom in and move around.*

**Settlement** is separate from all this. When Bob's bank credits him, no money has moved **between banks** yet. NPCI
adds up what every bank owes every other bank over a **settlement cycle** (there are several cycles a day) and the
banks settle only the **net** amounts, through their accounts at the RBI. So customers see money instantly, while
banks exchange money in a few large batches. This is called **deferred net settlement**.

## 5. Requirements for the design question

The interviewer usually asks one of two things: **"Design the backend of a UPI app (a PSP)"** or **"Design the UPI
switch"**. Both share most requirements.

### Functional

- Onboard a user: bind the device, link bank accounts, create a VPA, set or reset the PIN.
- **Pay** to a VPA, a QR code, a mobile number or an account number with IFSC.
- **Collect**: merchants request money; users approve or decline before the expiry.
- Check balance (through the bank), see transaction history, raise a complaint on a transaction.
- Show the true status of every transaction, including pending ones, and notify both sides.

### Non-functional

| Property | Target | Why it matters |
| --- | --- | --- |
| **Correctness** | Money moves **exactly once**; never double-debit, never lose a debit | It is people's money; mistakes become complaints, compensation and regulatory trouble |
| **Latency** | A few seconds end to end; our own share well under one second | People pay at a counter with a queue behind them |
| **Availability** | 99.99% or better for the switch; a PSP should survive one sponsor bank's outage | A national payment system cannot go down at lunchtime |
| **Throughput** | Tens of thousands of payments a second at peak (section 6) | Salary days, festivals, peak hours |
| **Security** | PIN never visible to the PSP; device bound; every message signed and encrypted | Payments are the first target of fraud |
| **Auditability** | Every state change recorded and kept for years | Disputes, regulators, reconciliation |

### Out of scope

UPI Lite (small payments from an on-device wallet without a PIN), AutoPay mandates for subscriptions, credit lines
on UPI, international UPI and the merchant onboarding process. Mention that they exist, then set them aside.

## 6. Back-of-the-envelope estimates

**Assumptions:** we design the switch for **1 billion transactions a day**, which is headroom over the record days of
around 750 million. Traffic is uneven: NPCI names 10:00–13:00 and 17:00–21:30 as peak hours, so assume the peak hour
runs at **3×** the daily average, and allow another **2×** for salary days and festivals.

- Average: $10^9 / 86{,}400 \approx 11{,}600$ transactions per second (TPS).
- Peak hour: $3 \times 11{,}600 \approx 35{,}000$ TPS.
- Design target with spikes: $2 \times 35{,}000 = 70{,}000$ TPS. Test at 100,000.
- **Messages at the switch.** One push payment is about **10 messages** (request, resolve request and reply, debit
  request and reply, credit request and reply, response, confirmation, plus acknowledgements). So the switch handles
  roughly $70{,}000 \times 10 = 700{,}000$ messages a second at the design peak.
- **Storage.** About **2 KB** per transaction for the record and its state history:
  $10^9 \times 2\text{ KB} = 2\text{ TB}$ a day, about **730 TB a year** before replication. Payment records are kept for years.
- **A large PSP** with, say, 40% of the traffic sees $0.4 \times 70{,}000 = 28{,}000$ TPS at the design peak.

What this tells us:

1. **Throughput is high but each payment is small.** This is a write-heavy, low-latency system with tiny records,
   not a storage problem. It partitions well by transaction ID.
2. **The slowest partner sets the pace.** A payment waits on two banks' core banking systems. Our own components must
   never block on them; they must use timeouts and asynchronous I/O.
3. **History grows forever**, so recent data stays in a fast store and older data moves to cheaper storage.

## 7. The API of a PSP backend

Our app talks to our backend over HTTPS. Our backend talks to NPCI (through the sponsor bank) using UPI's own
signed XML messages.

| Method and path | What it does |
| --- | --- |
| `POST /v1/devices/bind` | Finish device binding after the SMS has arrived; returns a device token. |
| `GET /v1/accounts` | Linked bank accounts (masked) and VPAs. |
| `POST /v1/vpa/validate` | Resolve a VPA and return the payee's registered name before paying. |
| `POST /v1/payments` | Body: `client_request_id`, payee VPA, `amount_paise`, note, encrypted PIN blob. Returns `txn_id` and `state`. |
| `GET /v1/payments/{txn_id}` | Current state; the app polls this while a payment is pending. |
| `POST /v1/collect-requests/{id}/approve` | Approve with the encrypted PIN blob (or `/decline`). |
| `GET /v1/transactions?cursor=...` | History, newest first, with a cursor. |

Two details interviewers like:

- **`client_request_id` is an idempotency key.** The app creates it once per "Pay" tap and reuses it on every retry.
  If the network drops after the server received the request, the retry returns the **same** transaction instead
  of creating a second payment.
- **Money is an integer number of paise** (`amount_paise = 50000` for ₹500), never a floating-point number, because
  0.1 + 0.2 is not exactly 0.3 in floating point.

## 8. High-level design of a PSP backend

[![Inside a payer PSP backend: the app sends pay requests to an API gateway that checks auth and device, the payment service runs the transaction state machine, asks the risk engine whether to allow it, writes to the transaction DB where the txn ID is unique, and sends UPI messages to NPCI through a connector via the sponsor bank; a status checker finds pending transactions and checks their status, and final states go to notifications](/img/system-design/upi/07-psp-backend.png)](/img/system-design/upi/07-psp-backend.png)

*Select the diagram to zoom in and move around.*

- **API gateway:** authenticates the user, checks the device token matches the bound device, rate-limits.
- **Payment service:** the heart. It owns the **transaction state machine** (the states from section 4) and is stateless
  itself; all state is in the transaction DB, so any instance can handle any request.
- **Risk engine:** limits and fraud scoring before a payment leaves us (section 10).
- **Transaction DB:** one row per transaction, keyed by `txn_id`, with a unique `client_request_id`. Sharded by
  `txn_id` (or by user for history queries, with a secondary index for the other access path).
- **UPI connector:** signs, encrypts and sends UPI messages through the sponsor bank, and receives NPCI's
  asynchronous responses. Responses can arrive on a different connection from the request, so the connector looks
  up the transaction by `txn_id`, never by "which thread was waiting".
- **Status checker:** a scheduler that finds transactions pending for more than about 90 seconds and asks for their
  status, within the allowed number of checks.
- **Notifications:** push and SMS to the user, sent once the state is final.

### The data model

[![PSP data model: users bind devices, own VPAs and link bank accounts; a bank account is the default for VPAs; a VPA pays many transactions, keyed by txn ID with a unique client request ID, and each transaction has a history of state-change events](/img/system-design/upi/08-data-model.png)](/img/system-design/upi/08-data-model.png)

*Select the diagram to zoom in and move around.*

- The PSP stores **references** to bank accounts (masked number, IFSC, an account reference), never the PIN and
  never a card number.
- `transactions.state` is the current state; `txn_events` is an **append-only** history of every change, with who
  caused it (`source`: our request, NPCI's response, a status check, reconciliation). When a customer complains, the
  history explains exactly what happened.
- `rrn` is filled in from NPCI's response; it is the reference that banks and customer support use.

## 9. Deep dive: exactly-once money movement

"Exactly once" over an unreliable network is impossible in the strict sense: a message can always be lost or
duplicated. What we can build is **effectively exactly once**: retries are allowed everywhere, and every retry is
harmless.

**1. One transaction, one ID, end to end.** The payer PSP assigns `txn_id` once. NPCI, the remitter bank and the
beneficiary bank all key their work on it. If a bank receives "debit ₹500 for txn T1" twice, it debits once and
returns the first result the second time. This is **idempotency**: doing it twice has the same effect as once.

**2. Idempotency at our own front door.** Before creating a transaction, the payment service inserts the row with the
unique `client_request_id`. A duplicate insert fails, so we return the existing transaction instead.

```sql
INSERT INTO transactions (txn_id, client_request_id, payer_vpa, payee_vpa, amount_paise, state)
VALUES (:txn_id, :req_id, :payer, :payee, 50000, 'INITIATED')
ON CONFLICT (client_request_id) DO NOTHING;
-- 0 rows inserted: a retry, so read and return the existing transaction
```

**3. State changes are compare-and-set.** Responses can arrive twice, late, or out of order (a status check's answer
and the original response may race). Every update names the state it expects to move from:

```sql
UPDATE transactions SET state = 'SUCCESS', rrn = :rrn, updated_at = now()
WHERE txn_id = :txn_id AND state IN ('INITIATED', 'DEBITED', 'PENDING');
```

If zero rows change, the transaction was already final, and the late message is ignored. A final state (Success,
Failed, Reversed) never changes again, except through an explicit refund or dispute that creates its own record.

**4. Timeouts never mean failure.** A timeout means "unknown". Mark the payment **Pending** and check its status
with the same ID. Never tell the user "failed" unless a bank or NPCI said so, and never retry the payment under a new
ID.

**5. Notify after the state is saved.** Write the new state and an "outbox" event in the same database transaction;
a separate worker sends notifications from the outbox. A crash between the two can no longer lose or duplicate the
"₹500 received" message (if the worker retries, the notification carries the txn ID so the app shows it once).

**6. The bank's ledger is the final truth.** The banks keep double-entry ledgers (every debit has a matching credit
somewhere). Our database is our **view** of the truth, and reconciliation (section 11) repairs it if it ever drifts.

## 10. Deep dive: security, limits and fraud

| Layer | What it does |
| --- | --- |
| **Device binding** | The SIM-and-device check means a stolen PIN alone is useless on another phone |
| **PIN in the common library** | The PSP app never sees the PIN; it is encrypted on the phone and checked by the bank |
| **Message security** | Messages between members and NPCI are signed and encrypted, over dedicated or secured links |
| **Payee name before paying** | Validating the VPA shows the registered name, catching typos and impostors |
| **Limits** | Generally ₹1 lakh per transaction for person-to-person payments, with higher limits for some merchant categories (tax, hospitals, education, investments). Banks may set lower limits, and new users or new devices get lower limits for an initial period |
| **Risk scoring** | PSPs and banks score each payment: new payee, unusual amount, new device, many payments in a short time, known mule accounts |
| **Collect restrictions** | Person-to-person collect requests stopped from October 2025, removing a common "approve to receive" scam |

The biggest fraud on UPI is not breaking cryptography; it is **social engineering**: convincing a person to approve a
payment or share a PIN. That is why the design questions about fraud are about **friction in the right places**:
show the payee's name, warn on first payments to a new payee, slow down unusual patterns, and make "receive money"
flows never ask for a PIN.

## 11. Deep dive: reconciliation

Three parties each keep their own record of every transaction: our database, NPCI's switch, and the bank. Over
billions of transactions and countless timeouts, they sometimes disagree. **Reconciliation** finds and fixes that,
every day.

[![Daily reconciliation at a PSP: our txn DB export, NPCI's settlement file and the bank statement go into a normaliser that makes one row per txn ID; a matcher joins on txn ID and RRN; matched rows close the transaction, disagreements go to a mismatch queue that fixes the state or reverses, and cases that cannot be auto-fixed go to ops review](/img/system-design/upi/09-reconciliation.png)](/img/system-design/upi/09-reconciliation.png)

*Select the diagram to zoom in and move around.*

Typical mismatches and their fixes:

- **We say Pending, NPCI says Success:** move to Success and notify (the response was lost).
- **We say Pending, the debit happened but no credit:** make sure the reversal is under way within the T+1 deadline.
- **We say Success, the bank has no matching entry:** escalate to operations at once; this should never happen.
- **A transaction NPCI has that we have no record of:** a bug or an attack; investigate.

Reconciliation is batch work (files arrive after each settlement cycle), so it runs on a separate data pipeline and
never slows the live payment path.

## 12. Deep dive: designing the switch itself

If the question is "design NPCI's switch", the shape is a **router with a short memory**.

- **Handle registry:** `@psp2 → PSP-2's endpoint`. Small, read on every message, so it lives in memory on every
  switch node and is updated when a member joins or changes.
- **Transaction state store:** the switch must remember, for each in-flight `txn_id`, which step it is on (resolving,
  debiting, crediting) and its deadline. This is short-lived, high-write data, partitioned by `txn_id`, replicated
  so a node crash does not lose the step a payment was on. Completed transactions move to long-term storage.
- **Asynchronous orchestration:** the switch sends "debit" and moves on; the bank's response arrives as a new
  message, which loads the state by `txn_id` and triggers the next step. No thread waits on a bank, so a slow bank
  ties up memory, not threads.
- **Per-member isolation:** each bank and PSP gets its own connection pools, queues, timeouts and **circuit
  breakers**. If one bank's core banking system is down, payments involving it fail fast with a clear reason, and
  payments between other banks are untouched. The switch cannot route around a bank; the money lives there.
- **Active-active data centres:** members connect to more than one site, and transactions continue if one site is
  lost. Because state is keyed by `txn_id`, a status check can be answered from either site.
- **Back-pressure:** when a bank slows down, the switch limits how many in-flight requests it sends to that bank
  rather than piling up a queue that will time out anyway.

In practice, most failed UPI payments are **technical declines** at banks (a core banking system that is slow or
down), not at the switch. NPCI publishes how often each bank declines for technical reasons, which puts pressure on
the weakest member, a nice example of designing the **ecosystem**, not just the software.

## 13. What breaks as it grows, and how to fix it

**The festival spike.** Traffic doubles in an evening. *Fix:* capacity planned for 2× the usual peak, load tests at
that level, autoscaling of stateless services, and shedding non-essential work (balance checks, history refreshes)
before payments.

**The status-check storm.** When a bank slows down, every app starts asking "what happened?" at once, which adds load
exactly where it hurts. *Fix:* wait before the first check, cap the number of checks, back off between them. NPCI
made these limits mandatory in 2025.

**The slow bank.** One bank's latency rises and threads pile up everywhere. *Fix:* asynchronous calls, per-bank
timeouts, circuit breakers, and showing users "your bank is facing issues" instead of spinning.

**The sponsor bank outage.** A TPAP whose handles all sit on one sponsor bank goes down with it. *Fix:* work with
several sponsor banks and spread users' handles across them.

**The growing history table.** Hundreds of terabytes a year. *Fix:* keep recent months in the hot store, move older
records to cheaper storage, and serve "my history" from a separate read model indexed by user.

## 14. Reliability: how we never lose or duplicate money

| Risk | Defence |
| --- | --- |
| The app retries after a network drop | `client_request_id` returns the same transaction |
| A response is lost | Pending state, status check with the same `txn_id`, then reconciliation |
| A message is delivered twice | Every member treats `txn_id` as an idempotency key |
| Debit succeeds, credit fails | Reversal to the payer, within T+1 by rule |
| Late or out-of-order responses | Compare-and-set updates; final states never change |
| Our records drift from the banks' | Daily reconciliation against NPCI and bank files |
| A data centre is lost | Replicated state and active-active sites |

## 15. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What UPI does and why |
| --- | --- | --- | --- |
| Network shape | Every bank connects to every bank | Central switch | **Central switch**: one connection per member, one set of rules |
| Order of steps | Credit then debit | Debit then credit | **Debit first**: a failure can only leave money to refund, never money created |
| On a timeout | Retry the payment | Check status of the same ID | **Check status**: retries with new IDs cause double debits |
| Where the PIN is entered | In the app | In NPCI's common library | **Common library**: apps never see the secret |
| Address lookup | Central directory of all VPAs | Handle routes to the PSP that resolves | **Handle routing**: NPCI stays small; PSPs own their users |
| Interbank money | Move money per payment | Deferred net settlement | **Net settlement**: customers get instant credit; banks settle a few net amounts a day |
| Collect requests | Allow for everyone | Merchants only | **Merchants only** since October 2025: fraud outweighed convenience |

## Cheat sheet for last-minute revision

- **Players:** payer app + payer PSP, payee PSP, remitter bank (debited), beneficiary bank (credited), NPCI UPI switch
  in the middle. Apps never hold money; banks do.
- **VPA** `name@handle`: the handle routes to the PSP that resolves it to an account and IFSC.
- **Two factors:** device binding by SMS from the SIM (have) + UPI PIN (know), typed into NPCI's **common
  library**, encrypted, checked by the remitter bank. The PSP never sees it.
- **Push (pay):** payer PSP assigns txn ID → NPCI → resolve payee → **debit** remitter → **credit** beneficiary →
  confirm both sides.
- **Pull (collect):** payee starts it, payer approves with PIN; person-to-person collect stopped in October 2025.
- **QR** = a `upi://pay?pa=...&am=...` link that pre-fills a push payment.
- **Timeouts mean unknown, not failed:** Pending → check status with the same ID (first after ~90 s, at most 3) →
  reconciliation → reversal by T+1 (₹100/day compensation after that).
- **Exactly once** = one `txn_id` end to end + idempotency keys + compare-and-set state machine + reconciliation.
- **Settlement:** customers are credited instantly; banks settle net amounts through RBI in cycles.
- **Numbers:** 20B+ transactions a month in 2025, ~750M on a record day; design for ~70K TPS and ~700K switch
  messages a second.

## Practice questions

1. **Alice's money was debited but Bob says he did not receive it. Walk through what happens.** Alice's app shows
   Pending. Her PSP checks status with the same txn ID; if the credit happened, both sides are updated. If it did
   not, the transaction is reversed to Alice by T+1, and reconciliation catches anything the live checks missed.
2. **Why does UPI debit before it credits?** A failed credit after a debit can be fixed by refunding the payer. A
   failed debit after a credit would mean the payee has money nobody paid, which is far harder to recover.
3. **The app's "Pay" request timed out. Should it retry?** It can resend the **same** request with the same
   `client_request_id`, which is safe. It must not create a new payment; it should show the status of the existing one.
4. **How would you design "split the bill" on top of UPI?** Store the split in the app; each friend then gets a
   reminder that opens a pre-filled **push** payment (like a QR link) to the organiser, rather than a collect request.
5. **How would you let a PSP survive its sponsor bank going down?** Spread new handles over several sponsor banks,
   isolate each bank's connector, and show users a clear message for affected handles; existing VPAs stay tied to
   their bank, so full failover needs planning at onboarding time.
6. **Why not keep a central directory of every VPA at NPCI?** Each PSP already owns its users' data and KYC; handle
   routing keeps NPCI's directory tiny (one row per handle) and lets PSPs add users without involving NPCI.
