export const calculateScore = (data) => {
    let score = 0;
    const suggestions = [];

    // 1. Name provided (+10)
    if (data.personal.name && data.personal.name.trim().length > 0) {
        score += 10;
    } else {
        suggestions.push("Add your full name (+10 points)");
    }

    // 2. Email provided (+10)
    if (data.personal.email && data.personal.email.trim().length > 0) {
        score += 10;
    } else {
        suggestions.push("Add a professional email (+10 points)");
    }

    // 3. Summary > 50 chars (+10)
    if (data.summary && data.summary.trim().length > 50) {
        score += 10;
    } else {
        suggestions.push("Write a summary longer than 50 characters (+10 points)");
    }

    // 4. At least 1 experience entry with bullets (+15)
    // Check if description has content (bullets implied by new line or just text)
    if (data.experience.length > 0 && data.experience.some(e => e.description && e.description.trim().length > 10)) {
        score += 15;
    } else {
        suggestions.push("Add at least 1 work experience with description (+15 points)");
    }

    // 5. At least 1 education entry (+10)
    if (data.education.length > 0) {
        score += 10;
    } else {
        suggestions.push("Add education details (+10 points)");
    }

    // 6. At least 5 skills added (+10)
    const totalSkills = (data.skills.technical?.length || 0) + (data.skills.soft?.length || 0) + (data.skills.tools?.length || 0);
    if (totalSkills >= 5) {
        score += 10;
    } else {
        suggestions.push("Add at least 5 skills (+10 points)");
    }

    // 7. At least 1 project added (+10)
    if (data.projects.length >= 1) {
        score += 10;
    } else {
        suggestions.push("Add at least 1 project (+10 points)");
    }

    // 8. Phone provided (+5)
    if (data.personal.phone && data.personal.phone.trim().length > 0) {
        score += 5;
    } else {
        suggestions.push("Add phone number (+5 points)");
    }

    // 9. LinkedIn provided (+5)
    if (data.links.linkedin && data.links.linkedin.trim().length > 0) {
        score += 5;
    } else {
        suggestions.push("Add LinkedIn profile (+5 points)");
    }

    // 10. GitHub provided (+5)
    if (data.links.github && data.links.github.trim().length > 0) {
        score += 5;
    } else {
        suggestions.push("Add GitHub profile (+5 points)");
    }

    // 11. Summary contains action verbs (+10)
    const actionVerbs = /built|led|designed|improved|created|managed|optimized|automated|reduced|increased|orchestrated|architected|engineered|deployed|launched|collaborated/i;
    if (data.summary && actionVerbs.test(data.summary)) {
        score += 10;
    } else {
        suggestions.push("Use strong action verbs in summary (e.g., Built, Led) (+10 points)");
    }

    return {
        score: Math.min(100, score),
        suggestions: suggestions
    };
};
