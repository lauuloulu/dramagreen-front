export const getWateringInfo = (lastWatered, frequency) => {
    if (!lastWatered || !frequency)
        return { ratio: 0, color: '#CCC', label: 'Sin datos', emoji: '❓', daysLeft: null };

    const last = new Date(lastWatered);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSince = Math.floor((today - last) / 86_400_000);
    const daysLeft = frequency - daysSince;
    const ratio = Math.max(1 - daysSince / frequency, 0);

    if (daysLeft > Math.ceil(frequency * 0.4))
        return { ratio, color: '#4CAF50', label: `${daysLeft}d`, emoji: '💧', daysLeft };
    if (daysLeft > 0)
        return { ratio, color: '#FFC107', label: `${daysLeft}d`, emoji: '⚠️', daysLeft };
    return { ratio, color: '#F44336', label: daysLeft <= 0 ? '¡Hoy!' : `¡${Math.abs(daysLeft)}d!`, emoji: '🆘', daysLeft };
};