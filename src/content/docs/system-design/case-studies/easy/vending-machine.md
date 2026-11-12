---
title: "Design a Vending Machine"
description: "Design a vending machine end to end: classes and the state pattern, change-making when coins run low, refunds and jams, and the connected fleet behind it."
difficulty: "Easy"
sidebar:
  label: "Vending machine"
tags: ["Object-oriented design", "State machines", "Payments", "IoT", "Algorithms"]
---

A vending machine is the classic warm-up for **object-oriented design** (OOD) interviews, and for good reason.
It is small enough to hold in your head, yet it hides every idea an interviewer wants to see: objects with clear
jobs, a **state machine** that decides what a button press means, an **algorithm** for giving change, and careful
handling of **money**, where one bug means a customer walks away angry or the owner loses cash.

Modern machines are also **connected devices**. A company may run tens of thousands of them, take card and UPI
payments, change prices from an office, and send a van only to machines that are actually running low. So a strong
answer covers both halves: the **object model inside one machine** and the **service around the fleet**.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. A vending machine in 5 minutes: what is inside the box

Before modelling anything in code, know the hardware. Each part becomes an object, an event or a failure case later.

| Part | What it does | Everyday analogy |
| --- | --- | --- |
| **Keypad and display** | The customer picks a slot code such as `B3`; the screen shows credit and messages | A shop counter |
| **Coin acceptor** and **note validator** | Check that inserted money is genuine and report its value; reject fakes | A cashier holding a note up to the light |
| **Coin tubes** (the changer) | One tube per coin value, used to pay out change | The coin tray in a till |
| **Cash box** | Locked box for notes and surplus coins; cannot pay out | The safe under the counter |
| **Slots** (spirals) | Each slot holds a column of one product; a motor turns the spiral once to push one item out | A shelf |
| **Drop sensor** | An infrared beam across the delivery bin that confirms an item really fell | A receipt proving delivery |
| **Controller** | The small computer that runs the software we are designing | The shopkeeper's brain |
| **Cashless reader** | Takes cards, phone taps and UPI QR payments | A card machine at the counter |
| **Modem** | 4G or Wi-Fi link to the company's cloud | A phone line to head office |

Inside the machine these parts usually talk over **MDB** (Multi-Drop Bus), a long-standing industry standard serial
bus that lets one controller drive coin changers, note validators and cashless readers from different makers.
You do not need its details in an interview; it is enough to say that peripherals send **events** ("₹10 coin
accepted", "item detected") and the controller sends **commands** ("pay out one ₹5 coin", "turn motor B3").

Two facts from this picture shape the whole design:

1. **The software reacts to events.** Nothing happens until a coin drops, a key is pressed, a sensor fires or a
   timer runs out. That is exactly what a state machine models well.
2. **The physical world can fail halfway.** A motor can turn while the item snags on the spiral. Power can cut
   between "take the money" and "drop the item". Every step that moves money or goods needs a plan for failure.

## 2. Requirements

### Functional: one machine

- Show products, prices and stock per slot.
- Accept **coins and notes**, and **cards / UPI** through the cashless reader.
- Let the customer **select** a product; dispense it if paid in full and in stock.
- Give **correct change**, and refuse a sale up front if exact change cannot be made.
- **Cancel** at any time before dispensing and get all inserted money back.
- Detect a **jam** (motor turned, nothing dropped) and refund automatically.
- **Maintenance mode** for staff: restock, collect cash, refill coin tubes, set prices locally.

### Functional: the connected fleet

- **Telemetry**: every sale, stock level, fault and a regular heartbeat reach the cloud.
- **Remote price and product updates** from an operator dashboard.
- **Card and UPI payments** authorised through a cloud payment service.
- **Restock and repair alerts**: tell field staff which machines need what, before they run out.

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Money correctness** | Never keep money without dispensing or refunding; every paisa reconciles | Trust, and the law in most places |
| **Works offline** | Cash sales continue with no network at all | Machines sit in basements, stations and car parks |
| **Responsiveness** | A key press reacts in under 100 ms; a cash vend finishes in a few seconds | People walk away from slow machines |
| **Crash safety** | After a power cut the machine knows whether a sale was in progress | Otherwise it either loses money or loses stock |
| **Fleet freshness** | Telemetry in the cloud within minutes; price changes applied within minutes | Good enough for restocking and pricing decisions |
| **Security** | Only genuine machines can talk to the cloud; card data never touches our controller | A stolen modem must not be able to fake sales |

### Out of scope

The motor and sensor electronics, the touchscreen UI design, accounting and tax, and the payment network's own
internals. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

The fleet is not "big data", and that is itself the lesson. Let us check.

**Assumptions:** a fleet of **50,000 machines**, each selling about **100 items a day**. Each sale produces about
**3 events** (sale, stock change, payment). Each machine also sends a **heartbeat every 5 minutes**. An event is
about **500 bytes** of JSON before compression.

- Sales: $50{,}000 \times 100 = 5\text{M}$ a day, about **58 per second** on average.
- Sale events: $5\text{M} \times 3 = 15\text{M}$ a day.
- Heartbeats: $50{,}000 \times (24 \times 60 / 5) = 50{,}000 \times 288 = 14.4\text{M}$ a day.
- Total: about $30\text{M}$ messages a day, roughly **350 per second** on average and about **1,000 per second**
  at a lunchtime peak (3× average).
- Storage: $30\text{M} \times 0.5\text{ KB} = 15\text{ GB}$ a day, about **5.5 TB a year** before compression.

Three conclusions follow:

1. **Throughput is easy.** A single modest message broker and database cluster handle this. Do not spend interview
   time sharding the fleet database.
2. **The hard parts are correctness and unreliable networks.** Machines go offline for hours, messages arrive late
   or twice, and money must still add up.
3. **Connections, not bytes, are the scaling unit.** 50,000 devices holding long-lived connections, and all of them
   reconnecting at once after a mobile network outage, is the real load spike.

## 4. Two designs in one

An interviewer usually starts with "design a vending machine" and means the **low-level design**: classes,
states and methods for one machine. Later they often ask "now there are 50,000 of them" and mean the
**high-level design** of the cloud side. Say this split out loud at the start:

| Layer | Question it answers | Main tools |
| --- | --- | --- |
| **Inside the machine** (sections 5–9) | What happens when a coin drops or a key is pressed? | Classes, the state pattern, change-making |
| **The fleet** (sections 10–14) | How do 50,000 machines get paid, priced, watched and restocked? | IoT messaging, payment service, event stream, alerts |

## 5. Low-level design: the object model

Start by naming the nouns: machine, inventory, slot, product, money, payment. Each becomes a class with **one job**.

[![Class diagram: VendingMachine owns an Inventory of Slots, each holding a Product, and a CashBox that counts Denominations; it accepts a PaymentMethod, implemented by CashPayment and DigitalPayment](/img/system-design/vending-machine/01-class-model.png)](/img/system-design/vending-machine/01-class-model.png)

*Select the diagram to zoom in and move around.*

- **`VendingMachine`** is the **context**: the single entry point for every event (`insert`, `select`, `cancel`). It
  holds the current `state`, the customer's `balance` and the `selected` slot, and it owns the other parts.
- **`Inventory`** maps a slot code (`"B3"`) to a `Slot`. It answers "is the machine completely empty?".
- **`Slot`** is one physical spiral: its code, how many items are left, the `Product` it holds and whether it is
  `jammed`. `release()` turns the motor once and reports whether the drop sensor saw an item.
- **`Product`** is a plain **record** (data only): SKU (stock-keeping unit, the product's catalogue ID), name, price.
- **`CashBox`** counts coins and notes per `Denomination` and owns the change algorithm (section 8).
- **`Denomination`** is an **enum** of accepted coins and notes with their value.
- **`PaymentMethod`** is an **interface** with `authorise`, `capture` and `refund`. `CashPayment` and
  `DigitalPayment` (card or UPI through the cloud) implement it, so the machine treats both the same way.

Four design decisions hide in this diagram.

**1. Money is an integer in the smallest unit.** Prices and balances are stored in **paise** (₹15 is `1500`), never
as floating-point rupees. `0.1 + 0.2` is not exactly `0.3` in binary floating point, and a machine that loses a
fraction of a paisa per sale ends the year with a cash box that does not reconcile.

**2. Slot and product are separate.** The same product can sit in two slots, and a slot can be refilled with a
different product. Stock belongs to the **slot** (physical), price belongs to the **product** (commercial). A
"planogram", the map of which product goes in which slot, is just the slot-to-product assignment.

**3. Composition, not a god class.** The machine *owns* its inventory and cash box (filled diamonds: they live and
die with it), but each part keeps its own rules. The machine coordinates; it does not count coins itself.

**4. Payment is behind an interface.** Adding a new method (a wallet, a staff badge) means a new class, not edits
to the selling logic. This is the **open/closed principle**: open for extension, closed for modification.

## 6. Low-level design: the state pattern

The same button means different things at different times. Pressing `B3` with no money should show the price;
pressing it with ₹20 inserted should sell the drink; pressing it while the motor is turning should do nothing.
Writing this as nested `if` statements in every method quickly becomes unreadable:

```text
select(code):
    if state == IDLE: show price
    elif state == HAS_MONEY: ...check price, stock, change...
    elif state == DISPENSING: ignore
    elif state == OUT_OF_SERVICE: show "out of order"
```

Every new state means editing every method. The **state pattern** turns this inside out: each state becomes its own
class that implements the same interface, and the machine simply forwards each event to whatever state it is in.

[![State pattern: VendingMachine holds a current State; IdleState, HasMoneyState, DispensingState and OutOfServiceState all implement the State interface with insert, select, cancel and dispensed](/img/system-design/vending-machine/02-state-pattern.png)](/img/system-design/vending-machine/02-state-pattern.png)

*Select the diagram to zoom in and move around.*

```text
class VendingMachine:
    insert(d):  state.insert(this, d)       # the machine never asks "which state am I in?"
    select(c):  state.select(this, c)
    setState(s): state = s

class HasMoneyState implements State:
    select(m, code):
        slot = m.inventory.slot(code)
        if m.balance < slot.product.price: m.display("Insert more"); return
        if slot.count == 0 or slot.jammed: m.display("Sold out"); return
        plan = m.cashBox.makeChange(m.balance - slot.product.price)
        if plan is None: m.display("Exact change only"); return
        m.setState(DispensingState(slot, plan))
```

Each state only implements the events that matter to it; the rest have a safe default (ignore, or return the coin).
Now the full picture of which event moves the machine where:

[![Lifecycle: Idle goes to Has money on a coin or note, to Dispensing on a valid selection, to Giving change when the item drops, and back to Idle when change is paid; cancel or timeout and a jam lead to Refunding then Idle; Idle can also go to Sold out until restocked, or Out of service on a fault until repaired](/img/system-design/vending-machine/03-states.png)](/img/system-design/vending-machine/03-states.png)

*Select the diagram to zoom in and move around.*

Points to say in the interview:

- **Has money** loops on itself: inserting another coin adds to the balance and stays in the same state (the
  drawing omits self-loops). A refused selection (too little money, sold out, no change) also stays here.
- **Dispensing** disables the coin acceptor so money cannot arrive mid-vend; a coin dropped anyway falls straight
  to the return cup.
- **Refunding** and **Giving change** both pay out coins. They are separate states because the reason matters for
  the audit log and the display ("Here is your change" versus "Sorry, refunded").
- **Sold out** means every slot is empty. A single empty slot is *not* a machine state; it is a check inside
  `HasMoneyState.select`.
- **Out of service** is entered on a hardware fault, an open door (maintenance mode), or a cash box that is full.
- The controller handles **one event at a time** from a single queue, so no two events race inside the object model
  and no locks are needed.

## 7. Flow 1: buying a drink with cash

A customer buys a ₹15 drink from slot `B3` with a ₹20 note.

[![Sequence for a cash sale: the customer inserts a ₹20 note, the note acceptor validates it, the controller displays ₹20; on selecting B3 the controller asks the CashBox to plan ₹5 change and it reserves one ₹5 coin; the slot motor turns once, the drop sensor reports the item, then the controller commits the sale and the CashBox pays the ₹5 coin into the tray](/img/system-design/vending-machine/04-cash-purchase.png)](/img/system-design/vending-machine/04-cash-purchase.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Change is planned before the motor turns.** If the machine dispensed first and only then discovered it had no
  ₹5 coin, it would owe the customer money it cannot pay.
- **The planned coins are reserved**, not paid out yet. If the vend then fails (a jam), the reservation is cancelled
  and the full ₹20 is refunded instead.
- **The sale is committed only when the drop sensor sees the item.** "Motor turned" is not proof of delivery.
- Every step is written to a small **local journal** on the controller's flash storage (section 9) before the next
  physical action, so a power cut at any point can be recovered.

## 8. Deep dive: making change

This is the algorithmic heart of the question, and interviewers love it.

**The problem:** the customer is owed an amount $A$ (balance minus price). The tubes hold a limited number of
coins of each value. Find a set of coins that adds up to **exactly** $A$, ideally using as few coins as possible,
or say that it is impossible.

### Why greedy is not enough

The obvious idea is **greedy**: always take the largest coin that still fits. With an unlimited supply of Indian
coins (₹1, ₹2, ₹5, ₹10, ₹20) greedy is actually optimal, because these values form a so-called *canonical* coin
system. But a vending machine never has an unlimited supply.

Example: the machine owes **₹6** and its tubes hold one ₹5 coin and three ₹2 coins, but no ₹1 coins.

- Greedy takes ₹5, leaving ₹1. There is no ₹1 coin, so greedy says **"cannot make change"**.
- Yet $2 + 2 + 2 = 6$ works. Greedy refused a sale it could have made.

(Greedy also fails for odd coin systems even with unlimited coins: with coins 1, 3 and 4, greedy pays 6 as
$4 + 1 + 1$, three coins, where $3 + 3$ needs two.)

### The fix: bounded coin change with dynamic programming

Treat every physical coin as an item you may use **at most once** (a 0/1 knapsack). Build up the fewest-coin way to
pay every amount from 0 to $A$:

```python
def make_change(amount, tubes):          # tubes: {coin value: count}, amounts in rupees
    plan = [[]] + [None] * amount        # plan[a] = fewest coins paying exactly a, or None
    for value, count in tubes.items():
        for _ in range(count):           # each physical coin can be used once
            for a in range(amount, value - 1, -1):   # go downwards so this coin is not reused
                prev = plan[a - value]
                if prev is not None and (plan[a] is None or len(prev) + 1 < len(plan[a])):
                    plan[a] = prev + [value]
    return plan[amount]                  # None means exact change is impossible
```

For the example, `make_change(6, {5: 1, 2: 3})` returns `[2, 2, 2]`. It runs
$O(A \times C)$ steps, where $C$ is the number of coins in the tubes (copying lists keeps the code short; storing
a coin count and a back-pointer per amount instead makes each step constant time). A real machine works in its smallest coin unit, owes
at most a few hundred rupees and holds a few hundred coins, so this is tens of thousands of steps: instant even on a
small controller.

### When exact change is impossible

The workflow below runs inside `HasMoneyState.select`, before anything physical happens:

[![Checks before the motor turns: after selecting B3 with ₹20, the machine checks enough money, then stock, then plans change; if a plan is found it reserves the coins and dispenses; otherwise it shows insert more, sold out, or exact change only, keeping the money as credit](/img/system-design/vending-machine/05-change-making.png)](/img/system-design/vending-machine/05-change-making.png)

*Select the diagram to zoom in and move around.*

Good machines go further than refusing:

- **Keep the money as credit.** A refused selection does not eat the money; the customer can pick a cheaper item,
  add coins to reach an exact amount, or cancel for a full refund.
- **Light "Exact change only" in advance.** When the tubes run low, the machine checks the worst case (for example,
  "can I still give change from a ₹50 note on the cheapest item?") and, if not, refuses large notes at the acceptor.
- **Refill tubes from customers' coins.** Inserted coins go into the tubes first and overflow to the cash box, so the
  machine naturally restocks its own change.
- **Prefer to spend plentiful coins.** Among equally short plans, choose the one that leaves scarce coins in the
  tubes. This is a small tweak to the comparison in the code above.
- **Report low tubes in telemetry**, so staff bring coins on the next visit.

## 9. Deep dive: refunds and failure cases

A vending machine runs unattended for weeks. Every failure needs an automatic, money-safe answer.

| Failure | What the machine does |
| --- | --- |
| Fake or damaged note or coin | The validator rejects it before it counts; it is pushed back out. No state change. |
| Customer presses **Cancel** or walks away (timeout, e.g. 60 seconds) | Has money → Refunding: pay out the whole balance, preferring the coins they inserted |
| **Jam**: motor turned, drop sensor saw nothing | Refund the full balance, mark the slot `jammed` so nobody else loses money on it, and send a fault event |
| Item snagged but falls later | The sensor reports a late drop; log it as stock lost, never charge twice |
| Payout fails while paying change (a coin sticks) | Pay what is possible, show "please contact" with a reference number, log the IOU; the operator refunds remotely (sections 11–12) |
| **Power cut** mid-sale | On restart, replay the local journal (below) |
| Door opened, cash box full, fridge too warm | Enter Out of service; reject money; send an alert |
| Several jams in a row on one machine | Treat as a hardware fault: Out of service until repaired |

### Surviving a power cut: the local journal

The controller writes every money or stock step to an **append-only journal** (a small log file on flash storage)
*before* doing it, in the same spirit as a database's write-ahead log:

```text
#1041 CREDIT     +2000 NOTE_20
#1042 SELECT     B3 price=1500 change=[500]
#1043 VEND_START B3
#1044 VEND_OK    B3
#1045 CHANGE_PAID 500
```

On boot, the controller reads the last entries. If it finds `VEND_START` without `VEND_OK` or a failure, it does
not know whether the item dropped, so it takes the customer-friendly choice: refund, mark the slot for a stock
check, and report it. Because the journal has sequence numbers, the same entries also feed telemetry, and the cloud
can spot gaps and duplicates.

## 10. High-level design: the connected fleet

Now zoom out to 50,000 machines and the company that owns them.

[![Fleet architecture: inside each machine the card/UPI reader tells the controller to vend, the controller logs to a local store and sends events through the device agent over MQTT/TLS to the cloud IoT gateway; the gateway feeds an event stream that updates the fleet DB and the restock and alerts service, which sends pick lists to the field staff app and alerts to the operator dashboard; the dashboard sets prices in the price and config service, which pushes config back through the gateway; the reader authorises payments through the payment service, which charges via the card/UPI network](/img/system-design/vending-machine/06-fleet.png)](/img/system-design/vending-machine/06-fleet.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Device agent:** the process on the machine that owns the modem connection, sends queued events and receives
  commands. It keeps working through outages by reading from the **local store** (store-and-forward).
- **IoT gateway:** the front door for devices. Each machine has its own **certificate** (a cryptographic identity),
  so the gateway knows which machine is talking and rejects anyone else (mutual TLS).
- **MQTT:** a lightweight publish/subscribe protocol built for small devices on poor networks. A machine publishes to
  topics such as `machines/VM-1042/events` and subscribes to `machines/VM-1042/commands`.
- **Event stream** (for example Kafka): a durable log of every machine event that several consumers read
  independently: the fleet database, restock planning, health monitoring.
- **Fleet DB:** machines, slots, current stock, prices, sales history.
- **Price and config service:** the source of truth for what each machine should sell and at what price.
- **Payment service:** creates orders for card and UPI payments, talks to the payment network, handles refunds.
- **Restock and alerts:** turns stock and fault events into pick lists for field staff and alerts for operators.

The most important rule of this design: **the machine must keep selling with the cloud gone.** Cash sales never
depend on the network. The cloud is for payments that need a bank, for oversight and for planning, not for the
basic act of selling a drink.

## 11. Flow 2: paying by card or UPI

Cashless payments are where the machine and the cloud meet, and where money bugs hide. Here is a UPI payment with a
**dynamic QR code** (a QR generated for this exact order and amount):

[![Sequence for a UPI payment: the customer selects B3 and chooses UPI, the machine creates an order with the payment service using an idempotency key, the service asks the UPI network for a dynamic QR and returns it; the customer scans and approves with their UPI PIN, the network calls back that it is paid, the service tells the machine to vend over MQTT, the machine reports the result, and if the vend failed the service issues a refund](/img/system-design/vending-machine/07-digital-payment.png)](/img/system-design/vending-machine/07-digital-payment.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The price comes from the order the server created**, not from what the customer's phone says. The payment
  service checks the callback's amount and signature before telling the machine to vend.
- **An idempotency key** (machine ID plus the machine's vend number) makes "create order" safe to retry on a flaky
  network: a repeat returns the same order instead of creating a second one.
- **Pay first, then vend, then settle.** If the vend fails (jam, power cut), the machine reports `failed` and the
  service refunds automatically. If the machine never reports at all, a timeout job asks it later or refunds.
- **Refunds are retried until done.** They are queued and retried with backoff; each has its own idempotency key so
  a retry never refunds twice.
- **QR codes expire** (here after 2 minutes). A late payment for an expired order is refunded automatically.

**Cards work slightly differently.** The reader asks for an **authorisation** (a hold on the funds, say ₹15), the
machine vends, and only after a successful drop does it **capture** (actually take) the money. A failed vend simply
**voids** the hold, so the customer is never charged in the first place. Card data stays inside the certified
reader and the payment network; our controller only ever sees "approved for ₹15" and a transaction ID. This keeps
the controller out of scope for card-security audits (PCI DSS).

## 12. Telemetry and restock alerts

Without telemetry, a restock driver visits every machine on a fixed route, finds half of them barely touched and
others empty since yesterday. With it, the van goes where the stock is needed.

[![Telemetry dataflow: heartbeats, vend events and fault events from the machine go through the IoT gateway into the event stream; a stock tracker turns vends into low-slot restock plans, the sales store produces daily reports, and a health monitor turns missed heartbeats and faults into repair tickets](/img/system-design/vending-machine/08-telemetry.png)](/img/system-design/vending-machine/08-telemetry.png)

*Select the diagram to zoom in and move around.*

- **Heartbeats** say "I am alive" with a few vital signs (temperature, tube levels, signal strength). If a machine
  misses, say, three in a row, the health monitor opens a ticket. A missed heartbeat alone may just be a dead modem,
  so the ticket says "unreachable", not "broken".
- **Events carry a per-machine sequence number** (from the journal). The cloud drops duplicates and notices gaps,
  which the agent fills by resending from its local store. MQTT's QoS 1 ("at least once") delivery plus de-duplication by
  sequence number gives effectively exactly-once processing.
- **Stock is tracked per slot**: last restock count minus vends since. A slot is "low" when it will run out before the
  next planned visit, which a simple forecast from recent sales rate gives: hours left = items left ÷ items sold per
  hour.
- **Pick lists** group low slots by route: "Machine VM-1042: 12 × water, 8 × cola, ₹200 in ₹5 coins". The driver
  restocks, and the machine's maintenance mode records the new counts, which flow back as events.
- **Event time, not arrival time.** A machine offline for six hours sends a burst when it reconnects. Sales reports
  use the timestamp from the machine, so the sales land on the right hour and day.

## 13. Remote price and config updates

The operator raises a price from ₹15 to ₹20 on the dashboard. How does that reach 50,000 machines safely?

1. **Versioned config.** The price and config service stores a full config per machine (planogram, prices, timeouts)
   with an increasing **version number**. A change creates version 43.
2. **Push, then pull.** The service publishes a small "config 43 is available" message on the machine's command
   topic. The machine downloads the whole config, checks its signature, and stores it.
3. **Apply only when Idle.** A price must never change while a customer has money inserted; the machine waits for
   the Idle state, applies version 43 atomically, and **acknowledges** it.
4. **Desired versus reported.** The cloud keeps two numbers per machine: the version it *wants* (43) and the version
   the machine *reports* (42). A dashboard shows machines that lag, and offline machines catch up automatically when
   they reconnect, because they always ask "what is my desired version?" on startup.
5. **Roll out gradually.** New firmware or big config changes go to a few machines first, then the fleet, with an
   automatic rollback to the previous version if fault events spike.

For card and UPI sales, the payment service prices each order from the **machine's current reported version**, so
the screen, the order and the charge always agree even mid-rollout.

## 14. Low-level design: the cloud data model

The cloud side is a modest relational database; Postgres or MySQL is plenty at this size.

| Table | Key columns | Notes |
| --- | --- | --- |
| `machines` | `machine_id`, `location`, `model`, `desired_config_version`, `reported_config_version`, `last_heartbeat_at` | One row per machine |
| `slots` | `(machine_id, slot_code)`, `product_id`, `capacity`, `count`, `jammed` | Current stock, updated from events |
| `products` | `product_id`, `sku`, `name` | Catalogue |
| `prices` | `(machine_id, product_id, config_version)`, `price_paise` | Price history per machine and version |
| `sales` | `(machine_id, seq_no)`, `slot_code`, `price_paise`, `method`, `event_time` | The unique key on `(machine_id, seq_no)` makes duplicate events harmless |
| `payments` | `order_id`, `idempotency_key` (unique), `machine_id`, `amount_paise`, `status`, `provider_txn_id` | Status: created → paid → vended / refunding → refunded |
| `alerts` | `alert_id`, `machine_id`, `kind`, `opened_at`, `closed_at` | Restock, fault, unreachable |

Raw events also go to cheap object storage for analytics; the tables above hold only current state and sales.

## 15. What breaks as it grows, and how to fix it

**The reconnect storm.** A mobile network outage ends and 20,000 machines reconnect in the same second, each
uploading hours of buffered events. *Fix:* random **jitter** in reconnect delays (wait a random 0–60 seconds),
exponential backoff on failures, rate limits per device at the gateway, and the event stream absorbing the burst.

**Duplicate and late events.** Store-and-forward guarantees nothing is lost but means some events arrive twice and
many arrive late. *Fix:* per-machine sequence numbers with a unique key in the database, and reports by event time.

**The money mismatch.** At the end of the day the cash collected does not match the sales recorded. *Fix:* the
journal records every coin in and out, the tube and cash box counts are reported in every heartbeat, and a daily
**reconciliation** job compares expected cash per machine with what staff collected and flags differences.

**Stuck refunds.** A payment provider is down, and refunds pile up. *Fix:* a durable refund queue with retries and an
alert when any refund is older than an hour; customers can be shown a reference number to check status.

**Too many alerts.** Every brief disconnect pages someone, and staff learn to ignore alerts. *Fix:* alert on
patterns (three missed heartbeats, three jams in an hour), group alerts per machine and route, and close them
automatically when the machine recovers.

**Firmware and config drift.** After a year, the fleet runs five firmware versions. *Fix:* desired-versus-reported
tracking for firmware as well as config, staged rollouts, and a dashboard of laggards.

## 16. Reliability: how we never lose money

| Risk | Defence |
| --- | --- |
| Customer pays, item never arrives | Commit a sale only on the drop sensor; jams refund automatically and mark the slot |
| Power cut in the middle of a sale | Write-ahead journal on flash; on boot, finish or refund any open sale |
| Machine cannot give change after vending | Plan and reserve the coins *before* turning the motor |
| A retried request charges twice | Idempotency key on order creation; captures and refunds are idempotent too |
| A duplicate event counts a sale twice | Unique `(machine_id, seq_no)` in the sales table |
| The cloud is unreachable | Cash sales work offline; events wait in the local store; cashless shows "card unavailable" |
| A fake device floods the cloud | Per-device certificates at the IoT gateway and per-device rate limits |

The pattern to remember is the same as in larger systems: **write it down durably before acting, make every
operation safe to repeat, and reconcile regularly.**

## 17. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| State handling | `if`/`switch` on a state enum | State pattern (one class per state) | **State pattern**: each state's rules live together; adding a state does not touch the others. An enum plus a transition table is also fine for small machines. |
| Change algorithm | Greedy | Bounded dynamic programming | **DP**: greedy refuses sales it could make when coins run low; DP is still instant at these sizes |
| When to check change | After vending | Before vending, with reservation | **Before**: never owe money you cannot pay |
| Card payment | Charge, then vend | Authorise, vend, then capture | **Authorise then capture**: a failed vend just voids the hold |
| Where the price lives | Hard-coded on each machine | Versioned config pushed from the cloud | **Versioned config**, applied only in Idle and acknowledged |
| Device protocol | HTTP polling | MQTT over persistent connections | **MQTT**: tiny overhead, server can push commands, built for flaky links |
| Offline behaviour | Refuse to sell without network | Sell cash offline, buffer events | **Sell offline**: the network is the least reliable part |

## Cheat sheet for last-minute revision

- **Two layers:** the machine (classes, states, change) and the fleet (IoT gateway, event stream, payments, alerts).
  Say this split first.
- **Classes:** `VendingMachine` (context) owns `Inventory` → `Slot` → `Product`, and a `CashBox` counting
  `Denomination`s; `PaymentMethod` interface with cash and digital implementations. Money in **integer paise**.
- **States:** Idle → Has money → Dispensing → Giving change → Idle; plus Refunding (cancel, timeout, jam), Sold out
  and Out of service. The machine forwards each event to its current state object.
- **Selection checks, in order:** enough money → in stock and not jammed → change can be made → reserve coins →
  dispense → commit on the drop sensor.
- **Change-making:** greedy fails with limited coins (owe ₹6 with one ₹5 and three ₹2 coins). Use bounded coin change
  DP, $O(A \times C)$. No plan → "Exact change only", keep the money as credit.
- **Failures:** jam → refund and mark slot; power cut → replay the write-ahead journal; door open or faults → Out of
  service.
- **Fleet:** device agent with store-and-forward → MQTT over mutual TLS → IoT gateway → event stream → fleet DB,
  restock planner, health monitor.
- **Cashless:** server-created order with idempotency key; UPI pay → vend → refund on failure; cards authorise →
  vend → capture or void.
- **Config:** versioned, pushed then pulled, applied only when Idle, desired versus reported version.
- **Numbers:** 50,000 machines × 100 sales = 5M sales a day (~58/s); ~30M messages a day (~350/s, ~1,000/s peak);
  ~15 GB a day. Scale is easy; correctness and flaky networks are hard.

## Practice questions

1. **The customer inserts ₹50 for a ₹15 item and the tubes hold three ₹10 coins and one ₹5 coin. What happens?**
   It owes ₹35: three ₹10 coins and the ₹5 coin make exactly that, so it sells. With only two ₹10 coins, no plan exists; it
   shows "Exact change only", keeps ₹50 as credit, and lets the customer choose another item or cancel for a full
   refund.
2. **How would you add a "buy two, get 10% off" offer?** Keep pricing out of the states: add a `PricingRule`
   interface the `HasMoneyState` asks for the final price, and deliver rules through the versioned config like prices.
3. **How would you support a machine with a touchscreen basket (several items in one purchase)?** Add a `Cart` to the
   context, plan change for the cart total, and dispense item by item; if one item jams, refund that item's price
   only and continue or cancel the rest.
4. **A machine reports 40 cans sold but the driver finds 45 missing. How do you investigate?** Compare the journal's
   vend and late-drop events, jam reports and maintenance-mode counts for that period. Unrecorded losses point to
   theft, a faulty drop sensor, or a restock count entered wrongly.
5. **How do you test the state machine?** Unit-test each state class with a fake machine, then run random event
   sequences (coins, selections, cancels, jams, power cuts) against a simple model and check one invariant after
   every step: money inserted = money paid out + value of items dispensed + current balance.
