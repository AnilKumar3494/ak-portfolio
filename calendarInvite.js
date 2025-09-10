document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("inviteForm");
    const emailInput = document.getElementById("email");
    const submitButton = document.getElementById("submitButton");
    const formGroup = document.getElementById("formGroup");

    const responseMessageDiv = document.getElementById("responseMessage");
    const responseIcon = document.getElementById("responseIcon");
    const responseText = document.getElementById("responseText");

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyYmu3bPV2n79YBC1uSPphErMxAGGrAmwLbR-QzqLtu71LrxemqDldZaj0K-w-FVciFVg/exec";

    form.addEventListener('submit', (e) => {
        e.preventDefault();


        submitButton.disabled = true;
        submitButton.classList.add('loading');
        formGroup.classList.add('loading');

        emailInput.disabled = true;

        responseMessageDiv.classList.remove('visible', 'success', 'error');

        // 2. Make the fetch request to the Google Apps Script
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: new URLSearchParams({
                email: emailInput.value
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                responseText.textContent = data.message;
                if (data.status === 'success') {
                    responseMessageDiv.classList.add('success');
                    responseIcon.className = 'fa-solid fa-circle-check';
                    form.reset();
                } else {
                    responseMessageDiv.classList.add('error');
                    responseIcon.className = 'fa-solid fa-circle-xmark';
                }
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                responseMessageDiv.classList.add('error');
                responseIcon.className = 'fa-solid fa-triangle-exclamation';
                responseText.textContent = 'An unexpected error occurred. Please try again.';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                formGroup.classList.remove('loading');
                emailInput.disabled = false
                responseMessageDiv.classList.add('visible');
            });
    });
});