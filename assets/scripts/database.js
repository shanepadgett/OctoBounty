function writeNewBountyData(issueUrlId, userOpened, bountyAmount, failCallback) {
  let issueHashId = getHashFromIssueId(issueUrlId)
  let issuesRef = database.ref('bounties')

  issuesRef.once('value')
    .then(snapshot => {
      if (snapshot.child(issueHashId).exists()) {
        failCallback()
      }
      else {
        issuesRef.child(issueHashId).set({
          user_opened: userOpened,
          issue_url: getFullIssueUrlFromId(issueUrlId),
          bounty_amount_posted: bountyAmount,
          is_open: true
        })

        let openIssuesRef = database.ref('open_bounties')
        openIssuesRef.child(issueHashId).set({
          user_opened: userOpened,
          issue_url: getFullIssueUrlFromId(issueUrlId),
          bounty_amount_posted: bountyAmount
        })

        let userOpenBountiesRef = database.ref('users').child(userOpened).child("open_bounties");
        userOpenBountiesRef.child(issueHashId).set(true)
      }
    })
}

function writeNewUserData(ghUsername) {
  let ref = database.ref('users')
  ref.once('value')
    .then(snapshot => {
      if (!snapshot.child(ghUsername).exists()) {
        let userRef = database.ref('users')
        userRef.child(ghUsername).set(true)
      }
    })
}

function addTrackBountyToUser(ghUsername, issueHashId) {
  let userTrackedBountiesRef = database.ref('users').child(ghUsername).child("tracked_bounties");

  userTrackedBountiesRef.once('value')
    .then(snapshot => {
      if (!snapshot.child(issueHashId).exists()) {
        userTrackedBountiesRef.child(issueHashId).set(true)
      }
    })
}

function removeTrackBountyToUser(ghUsername, issueHashId) {
  let userTrackedBountiesRef = database.ref('users').child(ghUsername).child("tracked_bounties");
  userTrackedBountiesRef.child(issueHashId).remove()
}

function ifBountyTracked(ghUsername, issueHashId, trueCallback, falseCallback) {
  let userTrackedBountiesRef = database.ref('users').child(ghUsername).child("tracked_bounties");

  userTrackedBountiesRef.once('value')
    .then(snapshot => {
      if (snapshot.child(issueHashId).exists()) {
        trueCallback()
      }
      else {
        falseCallback()
      }
    })
}