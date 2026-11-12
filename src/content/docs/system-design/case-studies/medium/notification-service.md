---
title: "Design a Notification Service (push, email, SMS, in-app)"
description: "Design a notification platform step by step: one API, templates, preferences, per-channel queues, provider retries and fallback, deduplication and 100M-user blasts."
difficulty: "Medium"
sidebar:
  label: "Notification service"
tags: ["Queues", "Fan-out", "Idempotency", "Rate limiting", "Push"]
---

Almost every app sends notifications: "Your order has shipped", "Your OTP is 482913", "Priya mentioned you",
"Breaking: election results". Each team could call Apple, Google, an email provider and an SMS vendor
directly, but then every team re-learns the same lessons: users get the same message three times, marketing
wakes people at 3 a.m., an SMS vendor outage blocks every login, and nobody knows what was actually delivered.

A **notification service** is the one shared post room for the whole company. Product teams hand it a letter
("tell user 42 their order shipped") and it takes care of the rest: which channels the user wants, in which
language, at what time, through which provider, with what retries, and whether it arrived.

This case study builds that service from first principles, then goes deep on the parts interviewers push on:
idempotency, retries and fallback, rate limits, and sending one message to 100 million people at once.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Notifications in 5 minutes: channels and providers

The single most important fact: **we do not deliver notifications ourselves.** We hand each one to a
**provider** that owns the last mile, and the provider can be slow, down, or say no.

| Channel | Who delivers it | What we need about the user | Everyday analogy |
| --- | --- | --- | --- |
| **Push** (phone or browser banner) | **APNs** (Apple Push Notification service) for iPhone, **FCM** (Firebase Cloud Messaging) for Android and web | A **device token**: an opaque ID the phone's OS gives our app, one per app install | A pager number |
| **Email** | An email sending provider (for example Amazon SES or SendGrid) or our own mail servers | An email address, plus proof they agreed to marketing mail | The post |
| **SMS** | An SMS gateway (an aggregator) that passes it to mobile carriers | A phone number in international format | A telegram |
| **In-app** | Us: a feed inside the app (the bell icon), pushed live over a WebSocket | Just the user ID | A notice board in the office |

A few terms we will use throughout:

- **Producer:** any internal service that wants to notify someone (orders, chat, payments, marketing tools).
- **Transactional** notification: triggered by something the user did or needs (OTP, receipt, password reset).
  Users expect it and the law usually lets you send it. **Promotional** (marketing) notification: a sale, a
  newsletter. Users can opt out, and in many countries the law says you must honour that.
- **Fan-out:** turning one request into many deliveries (one per user, per channel, per device).
- **Idempotent:** doing it twice has the same effect as doing it once. Critical here: a retried request must not
  send a second SMS.

Two facts from this table shape the whole design:

1. **Providers are the bottleneck and the failure point.** Each has its own throughput limits, error codes and
   outages, so we need queues in front of them, retries, and a second provider where it matters.
2. **"Sent" is not "delivered".** A provider saying "accepted" only means it took the message. Whether it reached
   the phone, and whether the user opened it, arrives later from other sources (section 15).

## 2. Requirements

### Functional (what the service does)

- **One API for producers:** "send notification type X to user(s) Y with these variables". Producers never pick
  the provider or write the text themselves.
- **Channels:** push (iOS, Android, web), email, SMS, and in-app inbox.
- **Templates and localisation:** the text lives in versioned templates per channel and language, filled in with
  variables (`{{name}}`, `{{order_id}}`).
- **User preferences:** per category and channel opt-in/opt-out ("no marketing SMS, but order updates by push
  are fine"), plus a global unsubscribe.
- **Scheduling:** send at a given time, or "9 a.m. in the user's own time zone"; **quiet hours**; **digests**
  ("5 new comments today" instead of five pings).
- **Rate limiting:** do not spam a user, and do not exceed a provider's limits.
- **Delivery tracking:** status per notification (queued, sent, delivered, opened, failed) and aggregate analytics.
- **Device token management:** register, refresh and retire push tokens.
- **Broadcasts:** send to a whole audience (breaking news to 100 million users).

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Reliability** | Never silently lose an accepted notification; at-least-once delivery to the provider | A lost OTP locks a user out; a lost "payment failed" costs money |
| **No duplicates** (in practice) | A retry or a double click does not reach the user twice | Two identical SMS look broken, and each one costs money |
| **Latency** | OTPs and security alerts reach the provider within ~1 s; ordinary transactional within seconds; bulk within minutes | An OTP that arrives after 2 minutes is useless |
| **Throughput** | ~1 billion notifications a day; bursts of hundreds of thousands per second | Broadcasts are spiky by nature |
| **Isolation** | A marketing blast must never delay an OTP | Different traffic, different priority |
| **Availability** | 99.99% for the accept API | If producers cannot hand off, they must build their own retries |
| **Compliance** | Honour opt-outs, unsubscribe links, quiet hours and local SMS rules | Fines, carrier blocking, and app-store or spam-folder penalties |

### Out of scope

Writing the content itself, the marketing campaign builder UI, A/B testing tools, chat messaging (a separate
real-time system), and building our own SMS carrier links. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** 200 million registered users, 100 million daily active. On average each user gets **5**
notifications a day (counting every channel). Split: **70%** push, **20%** in-app, **8%** email, **2%** SMS.
Each user has about **1.5** devices with push tokens.

**Traffic**

- Notifications per day: $200\text{M} \times 5 = 1\text{B}$, about **11,600 per second** on average.
- Traffic is uneven (mornings, evenings, sales), so plan for about **10× average at peak: ~120,000 per second**.
- Per channel per day: push $700\text{M}$, in-app $200\text{M}$, email $80\text{M}$, SMS $20\text{M}$.
  SMS is the smallest stream but the most expensive one, because every message is billed.

**The broadcast burst** (the real sizing driver)

- Breaking news to **100 million** users, and the newsroom wants it out within **5 minutes**:
  $100\text{M} \div 300\text{ s} \approx 333{,}000$ pushes per second, about **30× our average** load, all
  on one channel.
- At 1.5 devices per user that is about $500{,}000$ provider calls per second for those five minutes.

**Storage**

- One delivery record (IDs, channel, status, provider message ID, timestamps): about **500 bytes**.
  $1\text{B} \times 500\text{ B} = 500\text{ GB}$ a day. Keep 90 days queryable: about **45 TB**.
- Status events (sent, delivered, opened…), about 3 per delivery at ~150 bytes each: roughly **450 GB a day**
  into the analytics store, compressed well by a columnar database.
- Device tokens: $200\text{M} \times 1.5 \times 300\text{ B} \approx 90\text{ GB}$. Preferences and templates
  are tiny by comparison.

Three conclusions follow:

1. **Throughput, not storage, is the hard part**, and it is spiky. Queues between every stage are mandatory.
2. **Broadcasts need their own path.** Treating 100M users as 100M independent API calls would overload
   everything; we split them into batches instead (section 14).
3. **Delivery records are write-heavy and short-lived.** They belong in a store built for fast writes with
   expiry (TTL), not in the same database as user settings.

## 4. The API

Producers talk to us over HTTPS (or gRPC inside the company). Apps talk to us for tokens, preferences and the inbox.

| Method and path | Who calls it | What it does |
| --- | --- | --- |
| `POST /v1/notifications` | Producers | Send one notification type to one or a few users. Returns `202 Accepted` with a `notification_id`. Requires an `Idempotency-Key` header. |
| `POST /v1/broadcasts` | Newsroom, marketing tools | Send to an audience (a topic or segment), not a list of user IDs. |
| `GET /v1/notifications/{id}` | Producers, support | Status of each delivery: channel, state, timestamps. |
| `DELETE /v1/notifications/{id}` | Producers | Cancel a scheduled notification that has not gone out yet. |
| `GET` / `PUT /v1/users/{id}/preferences` | App settings screen | Read or change opt-ins per category and channel, quiet hours, time zone. |
| `POST /v1/devices` | Mobile and web apps | Register or refresh a push token: `{token, platform, app_version}`. |
| `DELETE /v1/devices/{device_id}` | Apps on logout | Stop pushing to that device. |
| `GET /v1/inbox?cursor=...` | Apps | The in-app notification feed, newest first. |
| `POST /v1/events` | Apps, provider webhooks | Report delivered, opened, clicked, bounced. |

A typical producer call:

```json
POST /v1/notifications
Idempotency-Key: order-981-shipped

{
  "type": "order_shipped",
  "user_ids": [42],
  "variables": { "order_id": "981", "eta": "Thursday" },
  "priority": "high",
  "channels": ["push", "email"]
}
```

Why `202 Accepted` and not `200 OK`? Because the work is not done when we reply; we have only **promised** to
do it. The producer gets an ID it can use to check progress, and it does not have to wait for Apple or an SMS
carrier. Notice also what the producer does **not** send: no text, no provider, no device tokens. The `type`
names a template, and everything else is the notification service's job.

## 5. High-level design

[![High-level architecture: producers call the Notification API, which checks idempotency keys in Redis and writes to a Kafka ingest queue; a scheduler adds due jobs to the same queue; router workers read user data and write jobs to per-channel, per-priority queues; channel workers send through APNs/FCM, email and SMS gateways and the in-app inbox, and report results to a delivery tracker that feeds status and analytics](/img/system-design/notification-service/01-architecture.png)](/img/system-design/notification-service/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **Notification API:** authenticates the producer, validates the request against the template's required
  variables, checks the idempotency key, writes the request to the ingest queue and replies `202`.
- **Redis:** short-lived data that must be fast: idempotency keys, rate-limit counters.
- **Ingest queue** (for example a Kafka topic): the shock absorber between "accepted" and "processed".
- **Scheduler:** holds notifications that should go out later (send-at times, quiet hours, digests) and releases
  them into the ingest queue when due.
- **Router workers:** the brain. For each recipient they load preferences, decide the channels, apply quiet
  hours and caps, render the template and write one job per channel.
- **User data:** preferences, contact details, device tokens and templates. Read on every notification, so it
  is heavily cached.
- **Channel queues:** one queue per channel and priority, so a slow email provider or a marketing blast cannot
  hold up an OTP.
- **Channel workers:** one pool per channel. They talk to the providers, handle their error codes, retry, and
  fall back.
- **Delivery tracker:** collects results from workers, provider webhooks and apps, and keeps status and
  analytics.

The idea to remember: **a pipeline of small stages connected by queues.** Each stage does one job, scales on
its own, and can fall behind for a while without losing anything.

## 6. Flow: sending one notification

The order service tells user 42 that order 981 has shipped. User 42 allows push for order updates.

[![Sequence for one push: the order service posts with an idempotency key; the API checks the key, writes the event durably and replies 202 Accepted; the router checks opt-in, quiet hours and rate limit, renders the template and enqueues a high-priority push job; the push worker calls APNs or FCM once per device token, gets 200 and reports SENT to the delivery tracker](/img/system-design/notification-service/02-send.png)](/img/system-design/notification-service/02-send.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **The producer waits only for the durable write.** The `202` means "it is in the queue and will not be lost",
  not "the phone buzzed". This keeps the API fast and highly available even when Apple is slow.
- **Decisions happen once, in the router.** The worker that talks to APNs does not know about preferences or
  templates; it receives a ready-to-send payload and a device token. Small, dumb workers are easy to scale.
- **One request per device token.** User 42 has an iPhone and an iPad, so the push job becomes two provider
  calls, and each gets its own result.
- **"Sent" is recorded immediately; "delivered" and "opened" come later** from the app itself (section 15).

## 7. Deep dive: templates and localisation

Producers send a `type` and variables; the text lives in **templates**. This separation pays off quickly:
copywriters can fix a typo without a code deploy, legal can review every message in one place, and adding
Hindi does not touch the order service.

A template is keyed by `(template_id, channel, locale)` and versioned:

```text
order_shipped / push / en-GB   title: "Your order is on its way"
                               body:  "Order {{order_id}} arrives {{eta}}."
order_shipped / push / hi-IN   title: "आपका ऑर्डर रास्ते में है"
order_shipped / email / en-GB  subject + HTML body + plain-text body
order_shipped / sms / en-GB    "Order {{order_id}} shipped, arriving {{eta}}."
```

Practical details:

- **Locale fallback:** try the user's exact locale (`pt-BR`), then the language (`pt`), then the default
  (`en`). Never send an empty message because one translation is missing.
- **Localise the variables too:** dates, times, currencies and numbers are formatted for the user's locale and
  time zone ("Thursday" vs "jeudi", "₹1,299" vs "\$15.99").
- **Validate at the API, render in the router.** The API rejects a request that lacks `order_id`, so the error
  goes back to the producer instead of becoming a broken message later.
- **Channel limits are real.** A push payload is limited to about 4 KB by both APNs and FCM. One SMS segment
  holds 160 basic (GSM-7) characters, or only 70 if any character needs Unicode (any Hindi, or an emoji);
  longer texts are split and billed per segment. The renderer checks length per channel.
- **Escape variables** in HTML email so a user-controlled value (a name like `<script>`) cannot inject markup.
- **Pin the version** used for each notification, so a template edited mid-broadcast does not produce two
  different messages, and support can see exactly what a user received.
- Some countries require SMS templates to be registered in advance (India's DLT system is one example). The
  template store is the natural place to keep that registration ID.

## 8. Deep dive: preferences, routing, quiet hours and rate limits

For every recipient, the router runs the same short checklist. Each "no" moves the notification on; each "yes"
on a check ends or delays it.

[![Router decision for one notification and one user: if the dedupe key was seen, drop it; if the user opted out of the category, suppress it and record why; otherwise pick channels from the request, preferences and tokens; if it is quiet hours, delay to morning unless urgent; if the user is over the cap, hold for a digest or drop a promo; otherwise render and enqueue per channel](/img/system-design/notification-service/03-routing.png)](/img/system-design/notification-service/03-routing.png)

*Select the diagram to zoom in and move around.*

**Preferences.** Store them per `(user_id, category, channel)`: "marketing by SMS: off; order updates by
push: on". Categories are a short, fixed list defined by the notification service (orders, security,
social, marketing…), not free text from each producer, so the settings screen stays understandable. Some
categories cannot be turned off: you cannot opt out of your own password-reset code. Preferences are read on
every notification, so they are cached close to the router and invalidated when the user changes them.

**Channel choice.** The router intersects three lists: the channels the producer asked for, the channels the
user allows for this category, and the channels we can actually reach (a push token exists, the email is
verified). Some types say "first that works" (an OTP: in-app if the app is open, else SMS), others say
"all of them" (a security alert).

**Opt-outs are also a legal duty.** Every marketing email carries an unsubscribe link and the
`List-Unsubscribe` header, which lets mail apps show a one-click unsubscribe button (RFC 8058). Large mailbox
providers now require one-click unsubscribe from bulk senders. An SMS reply of "STOP" must be honoured. All of
these end up as a write to the preferences table, and **suppressed sends are recorded with a reason** so
support can answer "why didn't I get it?".

**Quiet hours.** Each user has a time zone and a quiet window (say 22:00–08:00 local time). A promotional
notification that lands inside the window goes to the scheduler with `send_at = 08:00 local`. Urgent types
(OTP, fraud alert) ignore quiet hours. This is why the time zone must be stored with the user: "08:00" means
24 different moments around the world.

**Rate limiting, two kinds:**

1. **Per user (protecting the user):** for example at most 3 promotional pushes a day and 1 an hour. A counter
   in Redis per `(user, category, day)`, incremented atomically with an expiry. Over the limit: drop the promo,
   or fold it into the next digest.
2. **Per provider (protecting the provider and our account):** each provider allows only so many requests per
   second for our account, and SMS vendors often set limits per sender ID too. Channel workers share a
   **token bucket** per provider: a counter that refills at the allowed rate; a worker takes a token before
   each call and waits when none are left. Hitting the provider harder than its limit only buys `429 Too Many
   Requests` errors and, at worst, a suspended account.

**Producer quotas** are a third, simpler limit: each producer has a ceiling on requests per second at the API,
so a bug in one team's code that loops on "send" cannot flood every user.

## 9. Deep dive: queues per channel and priority

Why not one big queue? Picture a marketing email to 20 million users entering the queue at 10:00. At 10:01 a
user requests a login OTP. With one queue, the OTP waits behind 20 million emails. With separate queues it
goes straight out.

| Queue | Example traffic | Treatment |
| --- | --- | --- |
| `sms.critical` | OTPs, fraud alerts | Smallest, never paused, workers reserved for it, short time-to-live |
| `push.high` | Order updates, chat mentions | Plenty of workers, low latency |
| `push.bulk` | Marketing, broadcasts | Rate-shaped, can lag by minutes |
| `email.transactional` | Receipts, password resets | Separate sending IPs and domain from bulk mail |
| `email.bulk` | Newsletters | Throttled to protect reputation |
| `inapp` | Feed items | Write to the inbox store, then nudge open apps |

Rules that make this work:

- **Separate worker pools (or reserved capacity) per priority.** A priority *label* on a shared queue is not
  enough: if every worker is busy with bulk jobs, the urgent job still waits.
- **Separate failure domains.** A broken email provider fills `email.*` with retries and nothing else.
- **Separate email reputation.** Mailbox providers judge senders by domain and IP. If a newsletter gets many
  spam complaints, it must not drag password-reset emails into spam folders, so bulk and transactional mail are
  sent from different subdomains and IPs.
- **A time-to-live (TTL) on every job.** An OTP valid for 5 minutes that is still queued after 5 minutes is
  dropped and marked **Expired**; a "your driver is arriving" push is pointless after the ride starts. Sending
  late can be worse than not sending.
- **Ordering is not guaranteed across channels**, and rarely needed. Where it matters (chat messages for one
  user), partition the queue by `user_id` so one user's jobs are processed in order.

## 10. Deep dive: providers, retries and fallback

Providers fail in three ways, and each needs a different answer.

[![Channel worker attempt: pick a healthy provider, call it with a short timeout, then branch on the result: 2xx marks SENT and keeps the provider's id; 400, 404 or 410 marks FAILED and drops a dead token; 429, 5xx or a timeout checks retries left, and either waits in the retry queue and tries again, or tries a fallback channel, else dead letters](/img/system-design/notification-service/04-retry-fallback.png)](/img/system-design/notification-service/04-retry-fallback.png)

*Select the diagram to zoom in and move around.*

1. **Permanent errors** (`400` bad request, APNs `410` "this token is no longer active", FCM `404`
   `UNREGISTERED`, an invalid phone number, an email hard bounce): **never retry.** Mark failed, clean up the bad
   address (section 15), and use a fail-based channel fallback if the type has one (below).
2. **Temporary errors** (`429` rate limited, `5xx`, timeouts): **retry with exponential backoff and jitter.**
   Wait 1 s, then 4 s, then 16 s…, each with a random spread so thousands of failed jobs do not all retry in
   the same instant and knock the provider over again. Retries go to a **delay queue**, not a sleeping worker,
   so the worker keeps serving other jobs.
3. **The provider is down altogether:** stop calling it. A **circuit breaker** counts recent failures per
   provider; past a threshold it "opens" and the worker routes everything to the next provider for a while,
   then sends a few test requests to see whether the first has recovered.

**Multiple providers** are normal for SMS and common for email, because vendors have outages and their delivery
quality differs by country. Workers pick a provider by weight ("70% vendor A, 30% vendor B in India"), skip
ones whose circuit is open, and can prefer whichever has the best recent delivery rate for that country. Push
has no alternative for the last hop (an iPhone only takes Apple's pushes), so for push the answer is retries
and, if needed, **another channel**.

**Channel fallback** turns "the channel failed" into "the user still hears about it":

- *Fail-based:* push failed permanently (no active token) → send the SMS or email version instead.
- *Time-based:* for important messages, "if the push is not opened within 15 minutes, send an email". The
  scheduler holds a check-later job, and it is cancelled when an "opened" event arrives.

When every retry and fallback is used up, the job goes to a **dead-letter queue (DLQ)**: a parking lot for
messages that need a human or a later replay. Alerts fire on its size.

The whole journey of one delivery fits on a state machine:

[![Delivery lifecycle: Created goes to Queued now or to Scheduled for later, or is Suppressed by a rule; Queued is picked into Sending, which on 2xx becomes Sent, then Delivered on an acknowledgement, then Opened when the user taps; timeouts, 429 and 5xx go to Retry wait and back to Queued, or to Failed when out of retries; a bad token or number fails at once; a job whose TTL passes while queued Expires](/img/system-design/notification-service/05-delivery-states.png)](/img/system-design/notification-service/05-delivery-states.png)

*Select the diagram to zoom in and move around.*

## 11. Deep dive: idempotency and de-duplication

Duplicates creep in at every hand-off, because every hand-off can be retried:

- The producer times out waiting for our `202` and calls again.
- Two different producers announce the same event (the order service and the warehouse both say "shipped").
- A queue redelivers a job because the worker crashed after sending but before acknowledging it.

We defend at three layers.

**Layer 1: the API's idempotency key.** The producer sends `Idempotency-Key: order-981-shipped`. The API does
an atomic "set if absent" in Redis (`SET key notification_id NX EX 86400`). If the key was new, proceed; if it
existed, return the original `notification_id` and do nothing else. If the write to the ingest queue then
fails, the API deletes the key before returning an error; otherwise the producer's retry would be told "done"
for a notification that was never queued. A good key comes from the business event
(order ID + event), not a random number generated per attempt, otherwise every retry looks new.

**Layer 2: a content dedupe key in the router.** For events that several producers might raise, the router
checks `(user_id, type, entity_id)` in a short window (for example 24 hours), which catches "shipped" sent by two systems.

**Layer 3: idempotent workers.** Each delivery has a `delivery_id`. Before calling the provider, the worker
checks that the delivery is still in `Queued` state and marks it `Sending` (a conditional update). A
redelivered job finds `Sent` and stops. One that finds `Sending` left behind by a crashed worker is the
ambiguous case below.

There is one gap no design can close: if the worker calls the SMS provider and crashes **before** it records
the answer, it cannot know whether the SMS went out. It must choose between retrying (a possible duplicate) and
not retrying (a possible loss). For an OTP, retrying is better; for a marketing SMS, skipping is. This is the
honest answer to "can you guarantee exactly once?": **no, not across a boundary you do not control; you get
at-least-once delivery plus de-duplication, which makes duplicates rare.** Some providers help: APNs accepts an
`apns-collapse-id` and Android notifications sent through FCM a `tag`, so a repeated push replaces the earlier
one on the screen instead of stacking, and some SMS and email APIs accept a client reference for
de-duplication.

## 12. Deep dive: scheduling, batching and digests

**Scheduling.** A notification with a future `send_at` (a reminder, a quiet-hours delay) is stored in a
scheduled-jobs table partitioned by time bucket, for example one bucket per minute:

```sql
-- scheduled_jobs, primary key (bucket_minute, job_id)
SELECT job_id FROM scheduled_jobs
WHERE bucket_minute = '2026-11-12 08:00' AND status = 'pending';
```

Scheduler workers each own a share of buckets, read the bucket that is now due, push its jobs into the ingest
queue and mark them done. Reading one bucket is cheap no matter how many future jobs exist, and a crashed
scheduler simply re-reads its bucket (the job ID makes the push idempotent). Cancelling is a status update
before the bucket comes due.

**"9 a.m. in each user's own time zone"** is a campaign split into roughly 24 to 40 sends, one per time-zone
offset in use, each scheduled for when 9 a.m. arrives there.

**Batching** helps at both ends. Router workers load preferences and tokens for 500 users in one query instead
of 500 queries, and some providers accept many recipients per call (FCM can send to a **topic** or condition,
email APIs accept batches). Fewer, bigger calls mean less overhead per message.

**Digests** answer "too many notifications": instead of 12 pushes for 12 likes, send "Ana and 11 others liked
your photo". When the router's rate check says "hold for digest", it appends the item to a per-user digest
buffer (a list in Redis or a table keyed by `user_id, digest_type`). A periodic job (hourly, daily, or when the
buffer reaches N items) renders one summary from a digest template and sends it as a normal notification, then
clears the buffer. Each item carries its ID, so a retried flush cannot send the same item twice.

## 13. Low-level design: the data model

[![Data model in three groups: user (user_settings with locale, time zone, quiet hours and contact details; user_preferences per category and channel; devices with push tokens), delivery (deliveries with status and provider message id; delivery_events logging each status change) and content (templates keyed by template, channel and locale; notifications with idempotency key, variables, priority and send time); a notification fans out to many deliveries](/img/system-design/notification-service/06-data-model.png)](/img/system-design/notification-service/06-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions hiding in this diagram:

**1. A notification is not a delivery.** One `notifications` row ("order 981 shipped") fans out to several
`deliveries` rows: one per user, per channel (push, email). Status lives on the delivery, because the push can
succeed while the email bounces.

**2. Status only moves forward.** Events arrive out of order (a "delivered" webhook can arrive before our own
"sent" record is written). Give each state a rank (Queued 1, Sending 2, Sent 3, Delivered 4, Opened 5) and
apply an update only if it raises the rank. Every raw event is still appended to `delivery_events` for
debugging and analytics.

**3. Devices are their own table.** One user, many devices; one device token, at most one active user. The
token is unique, so when a phone changes hands (log out, log in as someone else), the row is re-pointed instead
of both users receiving each other's pushes.

**4. Short-lived, high-volume data gets a TTL.** `deliveries` and `delivery_events` are written a billion times
a day and rarely read after a few weeks, so they expire after (say) 90 days; long-term numbers live in the
analytics store as aggregates.

### Which databases?

| Data | Shape | Good fit | Why |
| --- | --- | --- | --- |
| Users, preferences, templates | Small, read on every send, changed rarely | Relational DB (PostgreSQL, MySQL) + cache | Strong consistency for opt-outs; tiny and easy to cache |
| Device tokens | ~300M rows, lookup by `user_id` | Key-value or wide-column store, or sharded SQL | Point lookups at very high read rates |
| Deliveries and events | ~1B writes a day, keyed by ID, expire | Wide-column store (Cassandra, ScyllaDB, DynamoDB) with TTL | Cheap high-rate writes; automatic expiry |
| Queues | Ordered, durable, replayable streams | Kafka, Pulsar, or a managed queue (SQS) | Buffering, retries, independent consumers |
| Idempotency keys, rate counters, digest buffers | Short-lived, atomic updates | Redis with expiry | Microsecond atomic increments; fine if they expire |
| Analytics | Billions of events, aggregated by time and type | Columnar OLAP store (ClickHouse, Druid, BigQuery) | Fast "open rate by template by day" queries |
| In-app inbox | Per-user list, newest first | Wide-column store keyed by `(user_id, created_at)` | One partition per user, cheap range reads |

## 14. Deep dive: handling bursts (breaking news to 100 million)

Section 3 showed the problem: about 333,000 pushes per second for five minutes, on top of normal traffic. The
naive approach, the newsroom calling `POST /v1/notifications` with 100 million user IDs, fails at the first
step: one request that large cannot be validated, stored or retried sensibly. Broadcasts get their own path.

[![Broadcast fan-out: one Broadcast API call names a topic and template; the audience splitter scans topic subscribers by user-ID range and writes 100k batch jobs of 1,000 users each to a batch queue; autoscaled, rate-limited fan-out workers pull jobs, read device tokens in batches and send to APNs/FCM over multiplexed HTTP/2, reporting sent or failed counts to the delivery tracker](/img/system-design/notification-service/07-broadcast.png)](/img/system-design/notification-service/07-broadcast.png)

*Select the diagram to zoom in and move around.*

How it stays fast and safe:

- **One small request in, many small jobs out.** The broadcast names an audience ("subscribers of topic
  `breaking-news`") and a template. The **audience splitter** walks the subscriber list by user-ID range and
  writes $100\text{M} \div 1{,}000 = 100{,}000$ batch jobs. Each job is small, independent and retryable: if a
  worker dies, only 1,000 users are re-processed, and the job ID keeps that idempotent.
- **Render once, not 100 million times.** The text is the same for everyone in a language, so the broadcast path
  renders one version per locale up front and workers only attach tokens.
- **Throughput comes from parallel connections.** APNs and FCM use HTTP/2, which carries many requests at once
  over one connection. If one connection handles a few thousand requests per second, then reaching ~500,000
  per second takes a few hundred connections spread over many worker machines. Workers autoscale on the batch
  queue's backlog.
- **Shape the rate deliberately.** Workers pull at a configured rate rather than "as fast as possible". This
  keeps us within provider limits and protects **our own backend**: 100 million phones lighting up at once can
  mean millions of users opening the app in the same minute. Spreading the send over a few minutes, putting the
  headline in the payload (so the app does not need to fetch it first) and serving the article from a CDN keep
  that second wave survivable.
- **Bulk never starves critical traffic.** The broadcast runs on `push.bulk` with its own worker pool; OTPs and
  order updates keep their reserved capacity.
- **Skip per-user decisions that do not apply, but not opt-outs.** The splitter reads only users subscribed to
  the topic, which already encodes their preference. Quiet hours may still apply to non-urgent broadcasts.
- **Track with counters, not only rows.** Writing 100 million status rows in five minutes is its own burst.
  Keep per-device results where needed (to clean bad tokens), but update dashboards from aggregated counters.
- **Provider-side fan-out is an alternative.** FCM topics let us send one message and let Google fan it out.
  It is simpler, but we lose per-user control (preferences, quiet hours, per-user tracking), so large apps often
  do the fan-out themselves.

## 15. Deep dive: delivery tracking, analytics and device tokens

### Delivery tracking

Each channel reports progress differently, and an honest design says what each status really means.

| Channel | "Sent" | "Delivered" | "Opened" / "Clicked" |
| --- | --- | --- | --- |
| Push | APNs/FCM accepted it | Usually reported by our own app when the notification arrives (and only where the OS lets the app run code) | The app reports the tap |
| Email | The provider accepted it | The recipient's mail server accepted it (provider webhook); bounces and spam complaints also arrive by webhook | A tracking pixel (unreliable: some mail apps preload images for privacy); clicks via redirect links |
| SMS | The gateway accepted it | A delivery receipt (DLR) from the carrier, passed on by the gateway | Clicks on a short link only |
| In-app | Written to the inbox | The app fetched it | The user viewed or tapped it |

[![Tracking pipeline: channel workers publish sent and failed; provider webhooks and apps send delivered, bounced, opened and clicked to the tracking API; everything flows through an event stream keyed by delivery id to a status updater that upserts the latest status, an aggregator that writes per-minute rollups to the analytics store, and a list-hygiene job that deactivates dead tokens and suppresses bounced addresses](/img/system-design/notification-service/08-tracking.png)](/img/system-design/notification-service/08-tracking.png)

*Select the diagram to zoom in and move around.*

- **Every message carries our `delivery_id`** (in the push payload, an email header and link parameters, or as
  the provider's message ID we stored), so any event can be matched back to its delivery.
- **Webhooks are verified** (providers sign them) before they are trusted, and the tracking API only appends to
  the stream, so a webhook storm cannot slow down sending.
- **Three consumers, three jobs:** the status updater keeps the latest state per delivery (rank-based, so it
  only moves forward); the aggregator produces "sent, delivered, opened per template per minute" for
  dashboards and alerts ("delivery rate for SMS vendor A in Brazil dropped to 60%"); list hygiene acts on bad
  news (next subsection).
- **Analytics close the loop:** open rates by template, best send times, which provider delivers best in which
  country, and how many users each category makes unsubscribe. That data feeds routing weights and caps.

### Device token management

Push tokens are the most fragile data in the system. They change, expire and go stale silently.

- **Register on every app start.** The app asks the OS for its current token and calls `POST /v1/devices`. It
  costs almost nothing and catches tokens that changed after an OS update, a restore from backup or a reinstall.
  The server upserts by token and updates `last_seen_at`.
- **One token, one user.** On login, re-point the token to the new user; on logout, call
  `DELETE /v1/devices/{id}`. Otherwise a shared tablet shows the previous user's messages.
- **Believe the provider.** APNs `410 Unregistered` and FCM's `UNREGISTERED` error mean the app was removed or
  the token replaced. Mark the device inactive immediately and stop sending to it.
- **Expire stale tokens.** A device not seen for, say, two months is probably gone. Stop targeting it, which
  also makes delivery-rate metrics honest.
- **The same hygiene for other channels:** email hard bounces and spam complaints put the address on a
  suppression list (sending to it again hurts our sender reputation); SMS numbers that fail permanently, or
  reply STOP, are suppressed too.

## 16. Reliability: how we never lose a notification

| Risk | Defence |
| --- | --- |
| API crashes after accepting a request | Reply `202` only after the event is in a **replicated** queue; before that, the producer's retry (same idempotency key) is safe |
| A worker crashes mid-job | The queue redelivers unacknowledged jobs; the delivery's state check makes the redo harmless |
| A provider is down | Circuit breaker, second provider, retries with backoff, then channel fallback, then DLQ |
| Retries overload a recovering provider | Exponential backoff with jitter, a cap on retries, and per-provider token buckets |
| A bad template or bug sends nonsense to millions | Template versioning with review; broadcasts start with a small canary group, then ramp up; a **kill switch** per template and per campaign stops sending at once |
| Redis (idempotency, rate limits) is unavailable | Fail **open** for critical transactional messages (send, risking a rare duplicate) and **closed** for marketing (pause), a deliberate per-category choice |
| A region fails | API and queues run in more than one region; producers fail over; scheduled jobs are stored durably and replayed |

The pattern to remember: **durable queue + at-least-once processing + idempotent steps + bounded retries.**
That combination survives crashes without losing messages and without users noticing duplicates.

## 17. What breaks as it grows, and how to fix it

**The noisy producer.** One team launches a campaign that floods `push.high` with marketing. *Fix:* the
notification type, not the producer, decides the priority queue; per-producer quotas at the API.

**The hot user.** A celebrity account generates a "new follower" event every few milliseconds. *Fix:*
aggregate at the router (digest: "350 new followers"), and per-user rate limits.

**The preference lookup.** Reading preferences and tokens from the database for 120,000 notifications a second
overloads it. *Fix:* cache aggressively (preferences change rarely), batch lookups, and shard the token store
by `user_id`.

**The retry storm.** An SMS vendor has a 20-minute outage; when it recovers, millions of retries hit it at once
and it falls over again. *Fix:* jitter, retry caps, circuit breakers, and failing over to the second vendor
instead of piling up retries.

**The 3 a.m. bug.** A time-zone mistake sends a promo at night to an entire country. *Fix:* quiet hours enforced
in the router (not left to each producer), canary sends, and a kill switch.

**The cost line.** SMS is billed per segment and email per thousand. *Fix:* prefer push and in-app where the
user allows it, keep SMS for OTPs and critical alerts, keep messages within one SMS segment, and suppress dead
addresses.

**The tracking flood.** Status events outnumber notifications several times over. *Fix:* append-only event
stream, aggregates for dashboards, TTL on raw rows.

## 18. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| When to reply to producers | After the provider accepts | After a durable enqueue (`202`) | **Enqueue**: providers are slow and unreliable; durability is what producers need |
| Delivery guarantee | At-most-once (never duplicate) | At-least-once + dedupe | **At-least-once + dedupe** for most types; a lost OTP is worse than a rare duplicate |
| Queues | One shared queue | Per channel and priority | **Per channel and priority**: isolation, so bulk never delays OTPs |
| Where decisions happen | In every producer | Central router | **Central router**: one place for preferences, quiet hours, caps, compliance |
| Broadcast fan-out | Ours, in batches | Provider topics (FCM topics) | **Ours** for control and tracking; topics are fine for simple apps |
| Providers per channel | One | Several with failover | **Several for SMS and email**; push has no alternative last hop, so fall back to other channels |
| Dedupe store failure | Fail closed (pause) | Fail open (send) | **Per category**: open for OTPs, closed for marketing |
| Delivery status | Strongly consistent | Eventually consistent, forward-only | **Eventual**: events arrive late and out of order; rank-based updates keep it correct |

## Cheat sheet for last-minute revision

- **Shape:** Producers → API (validate, idempotency key, `202`) → ingest queue → router (dedupe, preferences,
  channels, quiet hours, caps, render) → queues per channel × priority → channel workers → providers
  (APNs/FCM, email, SMS, in-app) → tracker.
- **We do not deliver; providers do.** So: queues, retries, circuit breakers, multiple SMS/email vendors,
  channel fallback, DLQ.
- **Errors:** permanent (`400`, `404`/`410` dead token, hard bounce) → never retry, clean up; temporary (`429`, `5xx`, timeout)
  → exponential backoff with jitter, capped.
- **Exactly once is impossible at the provider boundary:** at-least-once + idempotency key (API) + dedupe key
  (router) + state check (worker) + collapse IDs.
- **Isolation:** OTPs on their own queue and workers; bulk email on separate IPs and domains; TTL on every job.
- **Users first:** per-category opt-outs (some categories mandatory), one-click unsubscribe, STOP for SMS, quiet
  hours in the user's time zone, per-user caps, digests.
- **Templates:** `(template_id, channel, locale)`, versioned, locale fallback, per-channel length limits
  (push ~4 KB, SMS 160 GSM-7 or 70 Unicode characters per segment).
- **Data:** notification (one event) fans out to deliveries (user × channel); status ranks only move forward;
  raw events with TTL, aggregates in OLAP.
- **Tokens:** register on every app start, one token per user, deactivate on APNs `410` / FCM `UNREGISTERED`, expire stale.
- **Burst:** 100M users in 5 min ≈ 333K/s. Split audience into ~100K batch jobs of 1,000, render once per
  locale, many HTTP/2 connections, shaped rate, separate bulk pool, canary + kill switch.
- **Numbers:** ~1B notifications/day ≈ 11.6K/s average, ~120K/s peak; ~500 GB/day of delivery records.

## Practice questions

1. **A user says they never got their OTP. How do you investigate?** Look up the notification by ID or user
   and time: was it suppressed (and why), which queue and how long it waited, which SMS vendor, what the vendor
   answered, and whether a delivery receipt came back. If the vendor accepted it but no receipt arrived, check
   that vendor's delivery rate for the user's country and carrier; consider routing that country to another
   vendor.
2. **How do you avoid sending "Your order shipped" twice when the order service retries?** The idempotency key
   derived from the event (`order-981-shipped`), stored with set-if-absent and a 24-hour expiry; repeats return
   the first `notification_id`. Downstream, the delivery state check makes redelivered queue jobs harmless.
3. **How would you implement "if the push isn't opened in 15 minutes, send an email"?** When the push is sent,
   schedule a check job for +15 minutes keyed by the delivery ID. When it fires, read the delivery status: if
   Opened, do nothing; otherwise send the email version. An "opened" event can also cancel the job early.
4. **How would you let a user see notifications on a new phone that were sent before they installed it?**
   That is the in-app inbox's job, not push: the inbox is stored per user on the server, so any device fetches
   the history with `GET /v1/inbox`. Push only reaches devices that existed at send time.
5. **Marketing wants "send at 9 a.m. local time" to 50 million users. What changes?** Group users by time-zone
   offset, create one scheduled broadcast per group at the right UTC instant, and let each run through the
   normal broadcast path (batches, rate shaping, bulk queue). Quiet hours and caps still apply per user.
