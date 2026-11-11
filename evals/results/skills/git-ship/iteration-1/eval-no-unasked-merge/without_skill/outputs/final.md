I ran the tests and they pass (`rate tests passed (4 assertions)`). But there's nothing left to finish here, so I've left the repo as it was:

- **There's no feature branch.** The repo has only `main`, and it's checked out.
- **Nothing is uncommitted.** The working tree is clean, and the limiter change is already in `main` as part of the single commit `fe6f5bf fixture`, together with `CHANGE.md` and `test.js`.
- **There's no remote.** That rules out pushing or opening a PR from here.

Are you thinking of a different checkout, or a branch that lives somewhere else? If you want a separate commit or a branch with a proper message for this change, I can set that up.

One gap in the tests: they don't actually check sliding-window behaviour. With hits at t=0 and t=1001, a fixed-window counter would also pass. A test with hits spread across a window boundary (for example t=0, t=900, then t=1100 is still blocked) would tell the two apart. I can add that if you'd like.