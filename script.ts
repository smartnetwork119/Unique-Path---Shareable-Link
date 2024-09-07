declare const html2pdf: any;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resume-form') as HTMLFormElement;
    const resumeOutput = document.getElementById('resume-output') as HTMLDivElement;
    const educationSection = document.getElementById('education-section') as HTMLDivElement;
    const workSection = document.getElementById('work-section') as HTMLDivElement;
    const skillsSection = document.getElementById('skills-section') as HTMLDivElement;

    let educationIndex = 1;
    let workIndex = 1;
    let skillIndex = 1;

    // Add more education fields dynamically
    document.getElementById('add-education')?.addEventListener('click', () => {
        const newEducation = document.createElement('div');
        newEducation.className = 'education-entry';
        newEducation.innerHTML = `
            <label for="degree-${educationIndex}">Degree:</label>
            <input type="text" id="degree-${educationIndex}" name="degree[]" required>
            <label for="institution-${educationIndex}">Institution:</label>
            <input type="text" id="institution-${educationIndex}" name="institution[]" required>
            <label for="year-${educationIndex}">Year:</label>
            <input type="text" id="year-${educationIndex}" name="year[]" required>
        `;
        educationSection.appendChild(newEducation);
        educationIndex++;
    });

    // Add more work experience fields dynamically
    document.getElementById('add-work')?.addEventListener('click', () => {
        const newWork = document.createElement('div');
        newWork.className = 'work-entry';
        newWork.innerHTML = `
            <label for="job-title-${workIndex}">Job Title:</label>
            <input type="text" id="job-title-${workIndex}" name="jobTitle[]" required>
            <label for="company-${workIndex}">Company:</label>
            <input type="text" id="company-${workIndex}" name="company[]" required>
            <label for="work-year-${workIndex}">Year:</label>
            <input type="text" id="work-year-${workIndex}" name="workYear[]" required>
            <label for="description-${workIndex}">Description:</label>
            <textarea id="description-${workIndex}" name="description[]" required></textarea>
        `;
        workSection.appendChild(newWork);
        workIndex++;
    });

    // Add more skill fields dynamically
    document.getElementById('add-skill')?.addEventListener('click', () => {
        const newSkill = document.createElement('input');
        newSkill.type = 'text';
        newSkill.id = `skill-${skillIndex}`;
        newSkill.name = 'skills[]';
        newSkill.required = true;
        skillsSection.appendChild(newSkill);
        skillIndex++;
    });

    // Generate Resume
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = formDataToObject(formData);

        // Handle Image Upload
        const pictureInput = document.getElementById('picture') as HTMLInputElement;
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const pictureUrl = event.target?.result as string;
            renderResume(data, pictureUrl);
        };

        if (pictureInput.files && pictureInput.files[0]) {
            reader.readAsDataURL(pictureInput.files[0]);
        } else {
            renderResume(data, '');  // If no picture, render without image
        }
    });

    function formDataToObject(formData: FormData): Record<string, any> {
        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
            if (!data[key]) {
                data[key] = value;
            } else {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            }
        });
        return data;
    }

    function renderResume(data: any, pictureUrl: string) {
        const username = data.username || 'user'; // Ensure you have the username
        const uniqueUrl = generateUniqueUrl(username);

        resumeOutput.innerHTML = `
<div class="resume-wrapper">
        <!-- Sidebar -->
        <aside class="sidebar">
            ${pictureUrl ? `<img src="${pictureUrl}" alt="Profile Picture" class="profile-picture">` : ''}
            <h1 class="name">${data.name}</h1>
            <p class="contact">${data.email}</p>
            <p class="contact">+92 ${data.phone}</p>
            <button id="toggle-skills-btn">Toggle Skills</button>
        </aside>

        <!-- Main Content -->
        <main class="content">
            <!-- Education -->
            <section id="education" contenteditable="true">
                <h2>Education</h2>
                <div class="section-content">
                    ${generateEducationHTML(data)}
                </div>
            </section>

            <!-- Skills -->
            <section id="skills" contenteditable="true">
                <h2>Skills</h2>
                <div class="section-content">
                    ${generateSkillsHTML(data)}
                </div>
            </section>

            <!-- Work Experience -->
            <section id="work-experience" contenteditable="true">
                <h2>Work Experience</h2>
                <div class="section-content">
                    ${generateWorkHTML(data)}
                </div>
            </section>
        </main>

        <!-- Action Buttons -->
        <div class="actions">
            <button id="download-btn">Download as PDF</button>
            <button id="share-btn">Share Resume</button>
            
        </div>
    </div>`;

        resumeOutput.style.display = 'block';
        addToggleSkillsListener();  // Add listener for toggling skills
        makeEditable(); // Make the sections editable
        addDownloadButtonListener(); // Add listener for downloading PDF
        addShareButtonListener(uniqueUrl); // Add listener for sharing URL
    }

    function generateUniqueUrl(username: string): string {
        return `https://${username}.vercel.app/resume`;
    }

    function addDownloadButtonListener() {
        const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
        const resumeContent = document.querySelector('.resume-wrapper') as HTMLElement;

        if (downloadBtn && resumeContent) {
            downloadBtn.addEventListener('click', () => {
                html2pdf().from(resumeContent).save('resume.pdf');
            });
        }
    }

    function addShareButtonListener(url: string) {
        const shareBtn = document.getElementById('share-btn') as HTMLButtonElement;

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(url).then(() => {
                    alert('Resume link copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy link: ', err);
                });
            });
        }
    }

    function addToggleSkillsListener() {
        const toggleSkillsBtn = document.getElementById('toggle-skills-btn') as HTMLButtonElement;
        const skillsSection = document.getElementById('skills') as HTMLElement;

        if (toggleSkillsBtn && skillsSection) {
            toggleSkillsBtn.addEventListener('click', () => {
                if (skillsSection.style.display === 'none') {
                    skillsSection.style.display = 'block';
                } else {
                    skillsSection.style.display = 'none';
                }
            });
        }
    }

    function makeEditable() {
        const editableSections = document.querySelectorAll('[contenteditable="true"]');

        editableSections.forEach((section) => {
            section.addEventListener('input', () => {
                // Here, you can implement the logic to save data when editing is done
                // For now, we're assuming the user changes are directly reflected
                console.log(`Section edited: ${section.id}`);
            });
        });
    }

    function generateEducationHTML(data: any): string {
        const degrees = data['degree[]'] || [];
        const institutions = data['institution[]'] || [];
        const years = data['year[]'] || [];
        
        if (!Array.isArray(degrees)) {
            return `<div class="education-item">
                        <h3>${degrees}</h3>
                        <p>${institutions} (${years})</p>
                    </div>`;
        }
        
        return degrees.map((degree: string, index: number) => `
                    <div class="education-item">
                        <h3>${degree}</h3>
                        <p>${institutions[index]} (${years[index]})</p>
                    </div>
            `).join('');
    }

    function generateWorkHTML(data: any): string {
        const jobTitles = data['jobTitle[]'] || [];
        const companies = data['company[]'] || [];
        const workYears = data['workYear[]'] || [];
        const descriptions = data['description[]'] || [];
        
        if (!Array.isArray(jobTitles)) {
            return `<div class="work-item">
                        <h3>${jobTitles}</h3>
                        <p>${companies} (${workYears})</p>
                        <p>${descriptions}</p>
                    </div>`;
        }

        return jobTitles.map((jobTitle: string, index: number) => `
                    <div class="work-item">
                        <h3>${jobTitle}</h3>
                        <p>${companies[index]} (${workYears[index]})</p>
                        <p>${descriptions[index]}</p>
                    </div>
        `).join('');
    }

    function generateSkillsHTML(data: any): string {
        const skills = data['skills[]'] || [];
        
        if (!Array.isArray(skills)) {
            return `<p class="skill-badge">${skills}</p>`;
        }

        return skills.map((skill: string) => `
                    <p class="skill-badge">${skill}</p>`).join('');
    }
});
