---
title: "Design an Authentication System"
description: "Design login for a large app: salted slow password hashes, sessions vs JWTs, refresh token rotation, MFA, Sign in with Google, rate limiting and key rotation."
difficulty: "Easy"
sidebar:
  label: "Authentication system"
tags: ["Security", "Tokens", "OAuth", "Rate limiting", "Caching"]
---

Every app with accounts has a front door. You type an email and a password, maybe a six-digit code from your
phone, and you are in. Behind that door sits an **authentication system**: the part of the product that decides
who you are, remembers that decision so you don't type your password on every click, and keeps strangers out
even when they have stolen half the internet's passwords.

It is a common interview question because it is small enough to design in 45 minutes, yet every detail is a
security decision. A design that is "mostly right" is usually broken. This case study builds the system from
first principles, explains each security mechanism and why it exists, then covers how to scale it and what
interviewers like to push on.

:::tip[How to read this]
If you have an interview tomorrow, jump to the [cheat sheet](#cheat-sheet-for-last-minute-revision) at the
end. If you have an hour, read top to bottom: every section builds on the previous one.
:::

## 1. Authentication in 5 minutes: the vocabulary

Two words get mixed up constantly, so separate them first.

- **Authentication (AuthN)** answers *"who are you?"*. You prove an identity, for example by knowing a password.
- **Authorisation (AuthZ)** answers *"what are you allowed to do?"*. Given that you are Alice, may you delete
  this invoice?

At an airport, showing your passport at security is authentication; your boarding pass letting you onto one
particular flight is authorisation. HTTP even has two status codes for this: **401 Unauthorized** really means
"not authenticated, log in", and **403 Forbidden** means "we know who you are, and the answer is no".

This case study is about authentication and the tokens it produces. Authorisation (roles, permissions) is
usually a separate service that reads the identity we hand it.

| Term | What it is | Everyday analogy |
| --- | --- | --- |
| **Credential** | Something that proves identity: a password, a code from an app, a security key | Your passport |
| **Factor** | A *kind* of credential: something you **know** (password), **have** (phone, key), or **are** (fingerprint) | Passport *and* a fingerprint scan |
| **MFA** (multi-factor authentication) | Requiring two or more different factors | A bank vault needing a key and a PIN |
| **Hash** | A one-way function: easy to compute, infeasible to reverse | A fingerprint of a document, not the document |
| **Session** | The server's memory that "this browser already logged in as Alice" | A wristband at a festival |
| **Token** | A string the client presents on each request to prove it is logged in | The wristband itself |
| **JWT** (JSON Web Token) | A token that carries signed claims ("user 42, expires at 10:15") | A signed, tamper-evident wristband |
| **OAuth 2.0 / OpenID Connect** | Standards for letting another provider (Google, Apple) vouch for a user | A friend who vouches for you at the door |

## 2. Requirements

### Functional (what users can do)

- **Sign up** with email and password, and **verify** the email address.
- **Log in** and **log out**, including "log out of all devices".
- **Stay logged in** for weeks on a trusted device without retyping the password.
- **Reset a forgotten password** by email.
- **Multi-factor authentication**: authenticator app codes (TOTP), push approval, and passkeys / security keys.
- **Sign in with Google** (and similar providers) instead of a password.
- **Let other services check identity** on every API request quickly.
- See and revoke **active sessions** ("Chrome on Windows, last used yesterday").

### Non-functional (how well it must do it)

| Property | Target | Why it matters |
| --- | --- | --- |
| **Security** | Survive a full database leak without exposing passwords; resist brute force, credential stuffing, phishing | One breach destroys trust in the whole product |
| **Availability** | 99.99% | If auth is down, *everything* is down: nobody can log in or refresh |
| **Latency** | Token verification under 1 ms inside services; login under 500 ms | Verification happens on every API call; login can afford deliberate slowness |
| **Scale** | 200 million accounts, 50 million daily active users | A large consumer app |
| **Revocation** | A stolen session can be killed within minutes | "Log out everywhere" after a stolen phone must work |
| **Privacy** | Don't reveal which emails have accounts; never log passwords or tokens | Account lists are valuable to attackers |

### Out of scope

Authorisation rules (roles and permissions), single sign-on for enterprise customers (SAML), being an identity
provider for *other* companies, fraud scoring models and the login page's UI. Mention them, then set them aside.

## 3. Back-of-the-envelope estimates

**Assumptions:** 50 million daily active users. Most stay logged in, so only about **10 million password logins**
happen per day. Access tokens last **15 minutes** and an active user is active for about **2 hours** a day. Each
active user makes about **200 API calls** a day.

**Traffic**

- Logins: $10\text{M} / 86{,}400 \approx$ **120 per second**, perhaps **600 per second** at peak (5×).
- Token refreshes: 2 hours of activity with a 15-minute token is about 8 refreshes, so
  $50\text{M} \times 8 = 400\text{M}$ a day $\approx$ **4,600 per second**.
- Token verifications: $50\text{M} \times 200 = 10\text{B}$ a day $\approx$ **116,000 per second**.

**CPU for password hashing.** We will deliberately use a *slow* hash. Say one hash takes about 50 ms of one CPU
core (a typical tuning). One core then does about 20 hashes per second, so 600 logins per second need about
**30 cores**. Now imagine an attacker replaying a leaked password list at 10,000 attempts per second: that is
**500 cores** of hashing. So rate limiting must happen *before* hashing, or the attacker exhausts our CPU.

**Storage.** Users: $200\text{M} \times 1\text{ KB} = 200\text{ GB}$. Refresh tokens:
$50\text{M}$ users $\times$ 2 devices $\times$ about 300 bytes $= 30\text{ GB}$, a few times that once we keep
recently used tokens for reuse detection. Both fit comfortably in a replicated database and an in-memory store.

Three conclusions follow:

1. **Verification is the hot path** (100,000+ per second). It must not need a network call per request.
2. **Login is rare but expensive by design.** Protect it with rate limits so attackers can't turn our own
   security (slow hashing) into a denial of service.
3. **The data is small.** This is not a storage problem; it is a correctness and availability problem.

## 4. The API

All endpoints are HTTPS only. Responses to "forgot password" and failed logins are deliberately vague.

| Method and path | What it does |
| --- | --- |
| `POST /v1/signup` | Create an account (email, password). Sends a verification email. |
| `POST /v1/login` | Email and password. Returns tokens, or `mfa_required` with a short-lived challenge ID. |
| `POST /v1/login/mfa` | Challenge ID plus a TOTP code or WebAuthn assertion. Returns tokens. |
| `POST /v1/token/refresh` | Swap a refresh token for a new access token and a new refresh token. |
| `POST /v1/logout` | Revoke the current refresh token (and session). |
| `POST /v1/logout/all` | Revoke every session of this user. |
| `POST /v1/password/forgot` | Email a reset link. Always answers `202` whether or not the email exists. |
| `POST /v1/password/reset` | Reset token plus new password. |
| `GET /v1/oauth/google/start` and `/callback` | "Sign in with Google" (section 13). |
| `GET /.well-known/jwks.json` | The **public** keys used to verify our tokens (section 15). |
| `GET /v1/sessions`, `DELETE /v1/sessions/{id}` | List and revoke active sessions. |

## 5. High-level design

[![High-level architecture: clients reach an API gateway that counts attempts in a rate-limit store and forwards login and token calls to the auth service; the auth service reads password hashes from the user DB, stores and revokes refresh tokens in the session store, signs tokens with keys from a key manager, sends reset links through an email provider and talks OIDC to Google; product services receive API calls with a JWT and verify it locally using public keys fetched from the auth service](/img/system-design/authentication-system/01-architecture.png)](/img/system-design/authentication-system/01-architecture.png)

*Select the diagram to zoom in and move around.*

What each piece does, in one line:

- **API gateway:** terminates TLS, applies rate limits (counters in Redis, keyed by IP and by account), and
  routes `/login` and `/token` calls to the auth service and everything else to product services.
- **Auth service:** the only component that checks passwords, runs MFA, and **issues** tokens. It is stateless:
  any instance can serve any request, because state lives in the stores below.
- **User DB:** accounts, password hashes, MFA factors, linked Google identities. Small and strongly consistent.
- **Session store:** refresh tokens and sessions, with expiry. Fast key lookups, so an in-memory store (Redis)
  backed by a database, or a database with a cache in front.
- **Key manager (KMS or HSM):** holds the private signing keys. A hardware security module (HSM) is a tamper-
  resistant device whose keys cannot be copied out.
- **Product services:** receive each request with an **access token** and verify it **locally** with our public
  key. No call to the auth service per request.
- **Email / SMS provider:** delivers verification links, reset links and notifications.
- **Google (OIDC):** an outside identity provider for "Sign in with Google".

The most important idea in the picture: **issuing is centralised, verifying is distributed.** Only the auth
service can mint tokens; every service can check them on its own.

## 6. Storing passwords: salted, slow hashes

The worst outcome for an auth system is a leaked database revealing millions of passwords, because people reuse
passwords across sites. So we **never store a password**, not even encrypted (whoever has the decryption key
has every password). We store a **hash**: a one-way fingerprint. At login we hash what the user typed and
compare.

A plain hash is not enough. Three ideas stack on top of each other:

**1. Salt.** If two users choose `sunshine1`, a plain `SHA-256` gives them the same hash, and attackers have
precomputed tables of hashes for billions of common passwords (**rainbow tables**). A **salt** is a random value,
unique per user (16 bytes is typical), mixed in before hashing and stored next to the hash. Now identical
passwords give different hashes, and precomputed tables are useless: the attacker must attack each user
separately.

**2. Slowness.** `SHA-256` is designed to be *fast*: a single modern GPU computes billions per second, so a
leaked table of salted SHA-256 hashes still falls quickly. **Password hashing functions** are deliberately slow
and tunable. If one guess costs 50 ms instead of a nanosecond, an attacker's billion guesses take years instead
of a second, while one honest login barely notices.

**3. Memory-hardness.** GPUs and custom chips have huge numbers of cores but little memory per core. A function
that needs, say, 19 MB of memory per guess strips that advantage away.

| Function | Slow? | Memory-hard? | Notes |
| --- | --- | --- | --- |
| **Argon2id** | Yes (time cost) | Yes (memory cost) | Winner of the 2015 Password Hashing Competition. The default choice today. OWASP's suggested minimum is about 19 MiB of memory, 2 iterations, 1 lane |
| **scrypt** | Yes | Yes | Good choice where Argon2 is unavailable |
| **bcrypt** | Yes (cost factor, each +1 doubles the work) | No | Battle-tested and fine; use cost 10 or more. Only the first 72 bytes of input count |
| **PBKDF2** | Yes (iteration count) | No | Use when a standard such as FIPS requires it, with a high iteration count (hundreds of thousands) |
| SHA-256, MD5 | No | No | **Never** for passwords |

The stored value is self-describing, so parameters can change later:

```text
$argon2id$v=19$m=19456,t=2,p=1$<salt in base64>$<hash in base64>
```

Practical rules that interviewers like to hear:

- **Upgrade on login.** When the parameters are raised, old hashes are not lost: at the user's next successful
  login we have the plain password in memory for a moment, so we rehash with the new parameters and save.
- **Pepper (optional).** A secret key mixed in (for example an HMAC of the password) and kept *outside* the
  database, in the key manager. A leak of the database alone is then useless. The cost is that losing or rotating
  the pepper is painful, so it needs its own plan.
- **Compare in constant time,** so the response time doesn't leak how many bytes matched.
- **Same work for unknown emails.** If the email doesn't exist, still hash the password against a dummy hash.
  Otherwise "unknown user" answers in 1 ms and "wrong password" in 50 ms, and an attacker can tell which emails
  have accounts.
- **Password rules.** Current NIST guidance (SP 800-63B-4) favours length over composition rules ("one capital,
  one symbol"): at least 15 characters when the password is the only factor (8 when it is part of MFA), long
  passphrases allowed (up to at least 64 characters), passwords found in breach lists rejected, and no forced
  periodic changes, which only push people to `Summer2024!` → `Autumn2024!`.

## 7. Flow 1: logging in with a password and a second factor

[![Login sequence: the app posts email and password to the gateway, which rate limits per IP and per account and forwards to the auth service; the auth service reads the user's hash and MFA status, verifies the password with Argon2id in constant time and asks for a second factor; the app sends a TOTP code, the auth service checks it, saves the hash of a new refresh token in the session store and returns a 15-minute access token and a refresh cookie](/img/system-design/authentication-system/02-login.png)](/img/system-design/authentication-system/02-login.png)

*Select the diagram to zoom in and move around.*

Things worth noticing:

- **Rate limiting happens first** (step 2), before any expensive hashing.
- **The first step does not log you in.** A correct password for an MFA-enabled account returns a **challenge
  ID**: a short-lived (a few minutes), single-use reference to "password verified for user 42". It is not a
  session and cannot call any API.
- **The session store keeps a hash of the refresh token,** not the token itself (step 10). If the store leaks,
  the hashes cannot be replayed. A fast hash such as SHA-256 is fine here because the token is 256 random bits,
  not a guessable password.
- **Two tokens come back** (step 12): a short-lived **access token** for API calls, and a long-lived
  **refresh token** to get new access tokens. Section 9 explains why there are two.
- **Error messages are generic:** "Invalid email or password", never "no such user".

## 8. Defending the login endpoint

A login endpoint is a public form that says yes or no to guesses. Attackers use it in three ways:

- **Brute force:** many passwords against one account.
- **Password spraying:** one common password (`Password1`) against many accounts, staying under per-account
  limits.
- **Credential stuffing:** replaying email/password pairs leaked from *other* sites. Because people reuse
  passwords, a small percentage succeed, and with millions of pairs that is thousands of accounts. This is the
  most common real attack.

Defence is a funnel: cheap checks first, so the slow hash only runs for requests that pass them.

[![Login defence funnel: a login attempt passes an IP rate limit (over the limit gives 429 Too Many Requests with Retry-After), then an account throttle (too many recent failures gives a CAPTCHA or growing delay), then the password check (no match gives a generic error and counts the failure), then the second factor if enrolled or risky (failure denies and notifies the owner), and finally tokens are issued and the failure count resets](/img/system-design/authentication-system/03-login-defence.png)](/img/system-design/authentication-system/03-login-defence.png)

*Select the diagram to zoom in and move around.*

**Rate limits on several keys.** A per-IP limit alone fails because botnets spread attempts over thousands of IP
addresses. A per-account limit alone fails against spraying. So count on several keys at once: per IP, per
account, per IP range or network, and globally (a sudden rise in failed logins across the site is itself an
alarm). The simplest implementation is a fixed-window counter in Redis (a sliding window or token bucket smooths
the burst at each window edge):

```text
key  = "login:fail:acct:" + user_id       value = count, expiry = 15 min
key  = "login:ip:" + ip                   value = count, expiry = 1 min
INCR the key; if this is the first increment, set the expiry (atomically, in a small Lua script);
refuse when over the limit
```

**Breached-password checks.** At signup, password change and even login, check the password against known
breach corpora (for example the Have I Been Pwned "range" API, which only receives the first 5 hex characters of
the password's SHA-1, so the full hash never leaves our server). Force a reset when a user's password appears.

**Signals beyond counters:** new device, new country, impossible travel, a known-bad IP or a headless browser
fingerprint. These raise a "risk score" that can demand a CAPTCHA or a second factor even for users without MFA
enabled ("step-up authentication").

### Account lockout: the trade-off

The obvious defence, "lock the account after 5 wrong passwords", has a nasty side effect: **anyone who knows your
email can lock you out**. An attacker can lock every account at a company in minutes. Softer options are usually
better:

| Approach | Stops brute force? | Can attackers abuse it? |
| --- | --- | --- |
| Hard lock until support unlocks | Yes | Yes: a cheap denial of service against any user |
| Temporary lock (for example 15 minutes) | Mostly | Partly: the attacker just keeps re-locking it |
| **Growing delay** (1 s, 2 s, 4 s… per account) plus CAPTCHA | Yes: guesses become very slow | Little: the real user can still get in |
| Lock only for unfamiliar devices or IPs | Yes | Little: the owner on their usual laptop is unaffected |

A good answer: exponential back-off and CAPTCHA per account, lock only attempts from *unfamiliar* contexts, and
always email the owner when something suspicious happens. NIST's guidance caps consecutive failures at 100 before
stronger measures, which shows how much the delays are expected to do the work.

## 9. Sessions vs tokens: remembering who is logged in

After login we need to recognise the user on every later request. There are two families of answer.

**Opaque session IDs (stateful).** The server creates a random ID (at least 128 bits from a cryptographically
secure random generator), stores `session_id → {user 42, expires …}` in a session store, and gives the ID to the
browser in a cookie. On each request, the server looks the ID up. The ID itself means nothing: it is like a
cloakroom ticket.

**Self-contained tokens (stateless), usually JWTs.** The server writes the facts into the token and **signs**
it. A JWT has three base64url parts separated by dots, `header.payload.signature`:

```json
{ "alg": "ES256", "kid": "2026-11-key-b" }
{ "iss": "https://auth.example.com", "sub": "42", "aud": "api.example.com",
  "iat": 1762950000, "exp": 1762950900, "jti": "c1f7…", "amr": ["pwd", "otp"] }
```

`iss` is who issued it, `sub` the user, `aud` who it is for, `exp` when it dies (here 900 seconds = 15
minutes after `iat`), `jti` a unique ID, `amr` how the user authenticated. Any service holding our **public key**
can check the signature and the expiry without calling anyone. Note that the payload is only encoded, **not
encrypted**: anyone can read it, so never put secrets in it.

| | Opaque session ID | JWT access token |
| --- | --- | --- |
| Verify a request | Look up the store (a network hop) | Check a signature locally (CPU only) |
| Revoke instantly | Easy: delete the row | Hard: it stays valid until `exp` |
| Size | ~32 bytes | Hundreds of bytes on every request |
| Best for | A single web app; anything needing instant logout | Many services, mobile apps, cross-region traffic |

**The usual answer is both:** a short-lived JWT **access token** (5–15 minutes) for fast, stateless checks on
every request, plus a long-lived, opaque **refresh token** stored server-side, which is checked only every 15
minutes and can be revoked instantly. Revocation then takes effect within one access-token lifetime at worst.

**Where the browser keeps tokens.** Store the refresh token (or session ID) in a cookie marked **`HttpOnly`**
(JavaScript cannot read it, so a cross-site scripting bug cannot steal it), **`Secure`** (HTTPS only), and
**`SameSite=Lax` or `Strict`** (not sent on most cross-site requests, which blocks most cross-site request
forgery, CSRF; keep state-changing actions off `GET` and add a CSRF token or an `Origin` check as a second
layer). Avoid `localStorage` for long-lived tokens: any injected script can read it. Mobile apps use the platform's
secure storage (iOS Keychain, Android Keystore). Also **issue a new session ID at login**, never reuse one from
before, or an attacker who planted a session ID can ride along (**session fixation**).

## 10. Refresh tokens: rotation, revocation and logout

A refresh token that lives 30 days is a juicy target. **Refresh token rotation** limits the damage: every time a
refresh token is used, it is exchanged for a **new** one, and the old one is marked used. All tokens descended
from one login form a **family**.

[![Refresh rotation sequence: the product API rejects an expired access token with 401; the client posts refresh token R1, the auth service finds it valid and unused in family F, marks it used, stores R2 and returns a new access token and R2; later an attacker replays the stolen R1, the store reports it already used, the auth service revokes the whole family F, so R2 dies too and the owner must log in again](/img/system-design/authentication-system/04-refresh-rotation.png)](/img/system-design/authentication-system/04-refresh-rotation.png)

*Select the diagram to zoom in and move around.*

Why this works: a refresh token should be used **exactly once**. If an old one shows up again, either the user or
an attacker is replaying a copy, and the server can't tell which. So it **revokes the whole family**: the
attacker is cut off, and the real user is simply asked to log in again. This is the approach recommended in the
OAuth 2.0 security best-practice document (RFC 9700) for clients that can't keep a secret.

One practical wrinkle: a phone may send a refresh request, lose the response on a bad network, and retry with the
same token. A small **grace window** (accept the just-rotated token for a few seconds and return the same new
pair) avoids logging out honest users on flaky networks. Reuse after the window, as in the diagram, triggers the
family revocation.

**Logout and revocation, precisely:**

- **Log out:** revoke this refresh token (and its family) and clear the cookie. The access token still works
  until it expires, at most 15 minutes. That is the accepted price of stateless verification.
- **Log out everywhere / password changed / account compromised:** revoke every family for the user. For the
  rare emergency that can't wait 15 minutes, keep a small **denylist** of revoked `jti`s (or a per-user
  "tokens issued before time T are invalid" marker) in a fast store that services check. It stays tiny because
  entries can be dropped once the tokens would have expired anyway.
- **Expiry:** refresh tokens have an **idle timeout** (unused for, say, 30 days) and an **absolute timeout**
  (re-enter the password after, say, 90 days however active you are).

[![Session lifecycle: signed out moves to MFA pending when the password is correct, or straight to active if no MFA is enrolled; MFA pending goes back to signed out on timeout or wrong codes and on to active when the second factor is ok; an active session ends as logged out when the user logs out, expired after for example 30 days idle, or revoked by a password reset, refresh-token reuse or an admin](/img/system-design/authentication-system/05-session-lifecycle.png)](/img/system-design/authentication-system/05-session-lifecycle.png)

*Select the diagram to zoom in and move around.*

## 11. Flow 2: forgotten password

Password reset is a second way into every account, so it must be as strong as login.

[![Password reset sequence: the user asks for a reset; the auth service saves a hash of a random token that expires in 20 minutes, queues an email with the raw token and always answers 202; the user follows the link and posts the token with a new password; the auth service checks the hash is unused and unexpired, stores the new Argon2id hash, marks the token used, revokes every session and sends a password-changed notice](/img/system-design/authentication-system/06-password-reset.png)](/img/system-design/authentication-system/06-password-reset.png)

*Select the diagram to zoom in and move around.*

The rules hiding in this flow:

- **The token is random and unguessable:** 32 bytes from a cryptographically secure random number generator
  (CSPRNG), not a user ID or a timestamp.
- **Store only its hash,** like a password. A database leak then doesn't hand out working reset links.
- **Short-lived and single-use:** 15–60 minutes, marked used on success. Requesting a new link invalidates older
  ones.
- **Same answer for every email** (step 4), with the email sent asynchronously so the timing is the same too.
  Otherwise the form tells attackers who has an account (**account enumeration**).
- **Kill existing sessions** after a reset (step 9): if an attacker was logged in, they are now out.
- **Notify the user** that the password changed, so a hijack is noticed.
- **Keep the token out of logs and referrers:** the reset page should send `Referrer-Policy: no-referrer`, and
  ideally the page moves the token from the URL into the form before loading anything else.
- If the account has MFA, ask for the second factor too, or the email inbox becomes a way around MFA.

## 12. Multi-factor authentication

A password is something you **know**, and it can be phished or leaked. A second factor of a different kind means a
stolen password alone isn't enough.

**TOTP (authenticator apps, RFC 6238).** At enrolment the server generates a random secret and shows it as a QR
code; the app and the server both store it. Every 30 seconds both compute
`HMAC(secret, current_time / 30)` and shorten it to 6 digits. The server accepts the current window and usually
one window either side for clock drift, and remembers the last accepted window so the same code can't be replayed.
Since the server must compute the code, it must be able to read the secret: store it **encrypted** with a key from
the key manager, not hashed.

**SMS codes.** Easy for users but the weakest option: SIM-swap fraud and phone-network attacks can redirect
messages, and codes can be phished. Fine as a fallback, not as the only factor for sensitive accounts.

**Push approval.** The app on a registered phone shows "Approve sign-in from Chrome in Berlin?". Convenient, but
users who get spammed with prompts sometimes tap Approve to make them stop (**MFA fatigue**). **Number
matching** (type the number shown on the login screen) fixes most of that.

**WebAuthn and passkeys.** The strongest common option. At enrolment the device (phone, laptop, security key)
creates a **public/private key pair for our site only**; we store the public key. At login we send a random
**challenge**, the device signs it with the private key after a fingerprint, face or PIN check, and we verify the
signature. Three properties make this special:

- **Nothing secret is stored on our side.** A database leak reveals only public keys.
- **Phishing-resistant.** The browser binds the signature to the website's real origin, so a look-alike site
  `examp1e.com` gets nothing usable. TOTP codes, by contrast, can be typed into a fake site and relayed.
- **Passkeys** are WebAuthn credentials synced across a user's devices by a password manager (for example
  iCloud Keychain or Google Password Manager), so they can replace the password entirely.

**Recovery codes** (ten single-use codes, stored hashed) let users in when they lose their phone. Account recovery
is the weak spot of every MFA system; treat it as carefully as login.

## 13. Sign in with Google: OAuth 2.0 and OpenID Connect in plain words

**OAuth 2.0** was designed for *delegation*: "let this photo-printing app read my Google Photos, without giving
it my Google password". Google hands the app an **access token** limited to what you approved (the **scope**).
OAuth by itself does not say who the user is. **OpenID Connect (OIDC)** is a thin layer on top that adds exactly
that: an **ID token**, a JWT signed by Google saying "this is user `sub` 1093…, email alice@gmail.com, and they
just signed in for *your* app".

The flow used by servers is the **authorization code flow**, with **PKCE** (Proof Key for Code Exchange):

[![Sign in with Google sequence: the browser clicks the button and our backend redirects it to Google with client id, scope, state, nonce and PKCE challenge; the user signs in at Google, which redirects back to our callback with a code and state; our backend checks state, then server-to-server exchanges the code, client secret and PKCE verifier for an ID token and access token, verifies the ID token's signature, issuer, audience, expiry and nonce, finds or creates the user by issuer and subject, and sets our own session cookie](/img/system-design/authentication-system/07-sign-in-with-google.png)](/img/system-design/authentication-system/07-sign-in-with-google.png)

*Select the diagram to zoom in and move around.*

What each odd-looking parameter is for:

- **`code`:** a one-time, short-lived ticket. It travels through the browser (the **front channel**), which is
  less trustworthy, so it is useless on its own: it must be exchanged server-to-server (the **back channel**)
  together with our client secret.
- **`state`:** a random value we set before redirecting and check on return. It proves the callback belongs to a
  login *we* started, which stops an attacker from logging a victim into the attacker's account (a CSRF attack).
- **PKCE:** we keep a random `code_verifier` and send only its hash (`code_challenge`) at the start. Exchanging
  the code requires the original verifier, so a code intercepted on the way is worthless. Mobile and single-page
  apps, which cannot keep a client secret, rely on it entirely; it is now recommended for every client.
- **`nonce`:** placed in the request and echoed inside the ID token, so an old ID token can't be replayed.
- **Verifying the ID token:** signature against Google's published keys, `iss` is Google, `aud` is *our* client
  ID (a token minted for another app must be rejected), `exp` in the future, `nonce` matches.

Two details catch people out. First, identify the user by **`(iss, sub)`**, not by email: emails can change and
be recycled, and `sub` is the provider's stable ID. Second, **account linking**: if `alice@gmail.com` already has
a password account, only link automatically when the provider says the email is verified, otherwise ask the user
to log in to the existing account first. After all this, Google's tokens are done with: we issue **our own**
session and tokens, exactly as after a password login.

## 14. Low-level design: the data model

[![Data model: users (id, unique email, email_verified, nullable password_hash, status, failed_logins, locked_until) in the middle; on the left mfa_factors and federated_identities keyed by issuer and subject; on the right refresh_tokens keyed by token hash with family_id, device, expiry, used and revoked times, and password_reset_tokens keyed by token hash with expiry and used time; every child table points to users.id](/img/system-design/authentication-system/08-data-model.png)](/img/system-design/authentication-system/08-data-model.png)

*Select the diagram to zoom in and move around.*

Design decisions in this diagram:

- **`email` is unique after normalisation** (trimmed and lower-cased) so `Alice@x.com` and `alice@x.com` are one
  account. It is the login lookup key, so it has a unique index.
- **`password_hash` is nullable:** users who only ever sign in with Google have no password.
- **Tokens are stored by hash** (`token_hash` is the primary key), so a lookup is one indexed read and a leak of
  the table reveals nothing usable.
- **`family_id`** groups rotated refresh tokens; revoking a family is one indexed update. `used_at` drives reuse
  detection; `device` powers the "active sessions" page.
- **`mfa_factors.kind`** is `totp`, `webauthn` or `sms`. A TOTP secret is stored encrypted; a passkey stores a
  public key and a `sign_count` that helps detect a cloned security key.
- **`federated_identities`** has the composite key `(issuer, subject)`, so one user can link Google *and* Apple.

**Which stores?** Users and factors live in a relational database (PostgreSQL or MySQL): small, needs unique
constraints and transactions (sign-up must not create two accounts for one email). Refresh tokens and sessions
need very fast key lookups with expiry: Redis with persistence and replication, or a database table with an
expiry index and a cache. Rate-limit counters are in Redis; losing them is harmless.

## 15. Key management and token signing

Every service trusts our JWTs because of the signature, so the signing key is the most valuable secret in the
company. Whoever holds it can mint a token for any user.

- **Use asymmetric signatures** (ES256, EdDSA or RS256). The auth service signs with a **private** key; services
  verify with the **public** key. With a shared-secret scheme such as HS256, every service that verifies tokens
  could also *forge* them, so one compromised service compromises everyone.
- **Keep private keys in a KMS or HSM.** Either the KMS signs each token (simplest, adds a little latency per
  issue) or it wraps a short-lived signing key that the auth service holds only in memory.
- **Publish public keys at a JWKS endpoint** (`/.well-known/jwks.json`). Each token's header carries a **`kid`**
  (key ID) saying which key signed it, and services cache the key set and refetch when they meet an unknown `kid`.
- **Rotate keys on a schedule** (for example every 90 days) without downtime: publish the new public key first,
  wait until every service's cache has it, start signing with it, and keep the old public key published until
  every token it signed has expired. In an emergency (key leaked) remove the old key at once and accept that
  everyone must refresh.
- **Verify strictly.** Accept only the algorithm you expect (never `alg: none`, never let the token choose), and
  check `iss`, `aud` and `exp` with at most a minute of clock-skew allowance. Most famous JWT bugs come from
  libraries trusting the header.

## 16. Scaling the auth service, and what breaks as it grows

**Stateless verification.** The 116,000 verifications per second never reach the auth service: each product
service checks signatures locally with a cached public key. This is the main reason to use JWT access tokens.

**Stateless auth instances.** Because sessions, counters and users live in shared stores, auth service instances
are interchangeable. Add instances behind the load balancer as login and refresh traffic grows. Password hashing
is CPU- and memory-heavy, so size those instances for it and cap concurrent hashes per instance so a spike queues
instead of running out of memory.

**The session store.** 4,600 refreshes per second (plus lookups and revocations) is easy for a Redis cluster
sharded by token hash, with replicas for failover. If the session store is a database, put the token table on its
own cluster so login traffic can't slow product queries.

**The user database.** 200 GB and a few hundred logins per second fit one primary with read replicas. Login reads
must go to the **primary** (or a replica known to be up to date): a stale replica might accept a password that was
just changed. Shard by `user_id` only when much larger, with a separate global email → user_id index for login.

**Multiple regions.** Access tokens verify anywhere. Refresh and revocation need the token store: either replicate
it across regions (accepting a few seconds' delay before a revocation is seen everywhere) or route each user's
refreshes to a home region.

**What breaks:**

- **Credential-stuffing storms** that burn CPU on hashing. *Fix:* rate limits and bot detection at the gateway,
  before the hash; autoscale on the queue of pending hashes.
- **The thundering herd of refreshes.** After an outage, millions of clients find their access tokens expired and
  refresh at once. *Fix:* clients add random jitter before refreshing and refresh a little *before* expiry; the
  auth service sheds load with `503` and `Retry-After`.
- **Big JWTs.** Teams stuff roles and preferences into tokens until every request carries 4 KB of headers. *Fix:*
  keep access tokens to identity and a few coarse claims; look up permissions in the authorisation service.
- **Key cache misses.** A freshly rotated `kid` makes every service fetch the JWKS at once. *Fix:* publish keys
  well before using them, and let services refetch at most once per short interval.

## 17. Reliability: when things fail

| Failure | What happens | Defence |
| --- | --- | --- |
| Auth service down | No new logins or refreshes | Run many instances in several zones. Existing access tokens keep working for up to 15 minutes, which buys time |
| Session store down | Refreshes fail | Replicated store with automatic failover. Fail **closed** (refuse) rather than accept unknown refresh tokens |
| Rate-limit store down | Counters lost | Fail **open** with a conservative in-memory per-instance limit, so a Redis blip doesn't lock out everyone |
| KMS unreachable | Cannot sign new tokens | Cache a wrapped signing key in memory for a limited time; alert loudly |
| Email provider down | Reset links delayed | Queue and retry; use a second provider for failover |
| Signing key leaked | Anyone can forge tokens | Emergency rotation: remove the key from JWKS, revoke refresh families if needed, investigate |

Note the deliberate asymmetry: when a **security decision** is unavailable (is this refresh token valid?), refuse;
when only a **protective counter** is unavailable, degrade gracefully.

## 18. Trade-offs to discuss in an interview

| Decision | Option A | Option B | What we chose and why |
| --- | --- | --- | --- |
| Remembering login | Server sessions | Stateless JWTs | **Both**: short JWT access tokens for speed, server-side refresh tokens for revocation |
| Access token lifetime | Long (hours) | Short (5–15 min) | **Short**: limits the damage of a leaked token and the revocation delay |
| Signing | HMAC shared secret | Public-key signature | **Public-key**: verifiers can't forge tokens |
| Password hash | Fast (SHA-256) | Slow, memory-hard (Argon2id) | **Argon2id**: makes offline cracking of a leak impractical |
| Brute-force response | Hard account lockout | Delays, CAPTCHA, step-up MFA | **Soft measures**: lockout lets anyone lock out a victim |
| Second factor | SMS | TOTP / passkeys | **Offer passkeys and TOTP**, SMS only as a fallback |
| Token storage in browser | `localStorage` | `HttpOnly` cookie | **Cookie**: script injection can't read it; `SameSite` plus a CSRF token or `Origin` check handles CSRF |
| Build or buy | In-house | Managed identity provider (Auth0, Cognito, Firebase Auth…) | Depends: buying is often wiser for small teams; large companies build for control and cost |

## Cheat sheet for last-minute revision

- **AuthN vs AuthZ:** who you are (401) vs what you may do (403).
- **Passwords:** never stored. Store **Argon2id** (or scrypt / bcrypt) hash with a per-user **salt**; optional
  **pepper** in the KMS; constant-time compare; hash a dummy for unknown users; rehash on login when parameters rise.
- **Tokens:** short-lived **JWT access token** (≈15 min, verified locally with a public key) + long-lived
  **opaque refresh token** (stored hashed server-side, revocable).
- **Rotation:** each refresh returns a new refresh token; reuse of an old one **revokes the whole family**.
- **Logout:** revoke the refresh token; access token dies at `exp`; denylist by `jti` only for emergencies.
- **Browser storage:** `HttpOnly`, `Secure`, `SameSite` cookie; new session ID at login (no fixation).
- **Login defence:** rate limits per IP, account, network and globally, *before* hashing; breached-password checks;
  delays and CAPTCHA rather than hard lockout; generic errors to prevent enumeration.
- **Reset:** random 32-byte token, stored hashed, single-use, ~20 min, same answer for every email, revoke
  sessions after.
- **MFA:** TOTP (shared secret, 30 s, encrypted at rest), push with number matching, **WebAuthn / passkeys**
  (public key only, phishing-resistant), SMS as a weak fallback, recovery codes.
- **OIDC:** authorization code + PKCE, check `state`, verify ID token (signature, `iss`, `aud`, `exp`, `nonce`),
  identify users by `(iss, sub)`, then issue **our own** tokens.
- **Keys:** asymmetric (ES256 / RS256), private key in KMS/HSM, JWKS with `kid`, rotate with overlap, reject
  `alg: none`.
- **Numbers:** ~120 logins/s, ~4,600 refreshes/s, ~116,000 verifications/s; one hash ≈ 50 ms, so rate limiting
  protects CPU.

## Practice questions

1. **Why not just encrypt passwords instead of hashing them?** Encryption is reversible: whoever gets the key
   (an insider, an attacker with server access) gets every password. A slow, salted hash cannot be reversed, so
   even a full leak only allows slow guessing, one user at a time.
2. **A user changes their password on their laptop. Their stolen phone is still logged in. What happens?** The
   password change revokes all refresh-token families, so the phone's next refresh fails. Its current access
   token works until it expires, at most 15 minutes. If that is too long, add the user to a "tokens issued before
   T are invalid" check that services consult.
3. **How would you implement "Remember this device for 30 days" so MFA isn't asked every time?** After a
   successful MFA, set a separate long-lived, signed or server-stored device token in an `HttpOnly` cookie, tied
   to the user. At the next login, a valid device token skips the second factor but not the password; it is
   revoked with the user's other sessions.
4. **How do you migrate a million old MD5 hashes to Argon2id without forcing resets?** Wrap them: store
   `Argon2id(md5_hash)` for every user now, with a flag saying so, which immediately protects the leaked-database
   case. At each user's next login, compute the real `Argon2id(password)` and replace the wrapped hash.
5. **An attacker controls 50,000 IP addresses and tries one common password against every account. Which defences
   still work?** Per-IP limits barely trigger. What works: a global failed-login rate alarm, rejecting breached
   and common passwords at signup, bot and device signals, step-up challenges for unfamiliar devices, and MFA,
   which makes a correct password insufficient.
