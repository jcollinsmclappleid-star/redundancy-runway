import { storage } from "../server/storage";

async function main() {
  const portalToken = `demo_webchat_${Date.now().toString(36)}`;
  const stripeSessionId = `cs_test_demo_${Date.now()}`;
  const reset = await storage.createPendingReset(stripeSessionId, portalToken);
  await storage.updateResetIntake(stripeSessionId, {
    name: "Demo User",
    email: "demo@example.com",
    contactMethod: "webchat",
    intakeAnswers: {
      situation: "Recently made redundant from a marketing role. Mortgage and two children.",
      main_worry: "How long savings will last while job searching.",
      timeline: "Redundancy effective in 2 weeks.",
    },
  });
  await storage.updateResetFulfilment(reset.id, {
    status: "Reply 1 ready",
    reply1: {
      hearing:
        "Under the information shared, the immediate pressure seems to be organising the next few weeks while income changes.",
      important:
        "Clarifying your redundancy package and essential monthly costs appears most important right now.",
      notPanic: "You do not need every long-term decision resolved in the first 48 hours.",
      firstAction:
        "Gather your redundancy letter, last payslip and a simple list of essential monthly costs.",
      clarification: "Which figures in your runway model are you least confident about?",
    },
  });
  console.log(`Portal URL: http://localhost:5000/redundancy-reset/portal/${portalToken}`);
  console.log("Admin: http://localhost:5000/admin/resets");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
