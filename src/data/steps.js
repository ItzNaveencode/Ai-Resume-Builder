/* Step definitions for the AI Resume Builder build track */

export const STEPS = [
    {
        number: 1,
        slug: '01-problem',
        title: 'Problem Statement',
        description: 'Define the core problem your AI Resume Builder solves.',
        artifactKey: 'rb_step_1_artifact',
    },
    {
        number: 2,
        slug: '02-market',
        title: 'Market Research',
        description: 'Analyze the market landscape and competitive positioning.',
        artifactKey: 'rb_step_2_artifact',
    },
    {
        number: 3,
        slug: '03-architecture',
        title: 'Architecture',
        description: 'Design the system architecture and technology stack.',
        artifactKey: 'rb_step_3_artifact',
    },
    {
        number: 4,
        slug: '04-hld',
        title: 'High-Level Design',
        description: 'Create the high-level design document with component diagrams.',
        artifactKey: 'rb_step_4_artifact',
    },
    {
        number: 5,
        slug: '05-lld',
        title: 'Low-Level Design',
        description: 'Detail the low-level design with data models and APIs.',
        artifactKey: 'rb_step_5_artifact',
    },
    {
        number: 6,
        slug: '06-build',
        title: 'Build',
        description: 'Implement the core features and functionality.',
        artifactKey: 'rb_step_6_artifact',
    },
    {
        number: 7,
        slug: '07-test',
        title: 'Test',
        description: 'Run comprehensive tests and quality assurance.',
        artifactKey: 'rb_step_7_artifact',
    },
    {
        number: 8,
        slug: '08-ship',
        title: 'Ship',
        description: 'Deploy and ship the final product.',
        artifactKey: 'rb_step_8_artifact',
    },
];

/**
 * Check if a step is unlocked.
 * Step 1 is always unlocked.
 * Steps 2-8 are unlocked only if the previous step has an artifact.
 */
export function isStepUnlocked(stepNumber) {
    if (stepNumber === 1) return true;
    const prevStep = STEPS.find(s => s.number === stepNumber - 1);
    if (!prevStep) return false;
    const artifact = localStorage.getItem(prevStep.artifactKey);
    return artifact !== null && artifact !== '';
}

/**
 * Check if a step is completed (has its artifact uploaded).
 */
export function isStepCompleted(stepNumber) {
    const step = STEPS.find(s => s.number === stepNumber);
    if (!step) return false;
    const artifact = localStorage.getItem(step.artifactKey);
    return artifact !== null && artifact !== '';
}

/**
 * Get the highest unlocked step number.
 */
export function getHighestUnlockedStep() {
    let highest = 1;
    for (let i = 2; i <= 8; i++) {
        if (isStepUnlocked(i)) highest = i;
        else break;
    }
    return highest;
}

/**
 * Get the count of completed steps.
 */
export function getCompletedCount() {
    return STEPS.filter(s => isStepCompleted(s.number)).length;
}
