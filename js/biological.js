document.getElementById('biologicalForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const biologicalData = {
        date: document.getElementById('date').value,
        healthConditionScore: document.getElementById('healthConditionScore').value,
        healthCondition: document.getElementById('healthCondition').value,
        sugarPercentage: document.getElementById('sugarPercentage').value,
        bloodPressure: document.getElementById('bloodPressure').value,
        averageTemperature: document.getElementById('averageTemperature').value,
        time: document.getElementById('time').value,
    };

    try {
        const response = await fetch('/biological', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(biologicalData)
        });

        if (!response.ok) {
            throw new Error('Failed to save biological indicator data');
        }

        document.getElementById('responseMessage').innerText = 'Biological indicator information saved successfully!';
        document.getElementById('biologicalForm').reset();
    } catch (error) {
        document.getElementById('responseMessage').innerText = error.message;
    }
});
