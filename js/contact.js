// Contact form submission
const contactForm = document.querySelector('#contactForm');

if(contactForm){
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();

        if(!name || !email || !message){
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/contact/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if(response.ok){
                alert("Message sent successfully!");
                contactForm.reset();
            } else {
                alert(data.message || "Failed to send message");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        }
    });
}
