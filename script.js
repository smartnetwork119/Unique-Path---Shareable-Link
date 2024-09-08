document.addEventListener('DOMContentLoaded', function () {
    var _a, _b, _c;
    var form = document.getElementById('resume-form');
    var resumeOutput = document.getElementById('resume-output');
    var educationSection = document.getElementById('education-section');
    var workSection = document.getElementById('work-section');
    var skillsSection = document.getElementById('skills-section');
    var educationIndex = 1;
    var workIndex = 1;
    var skillIndex = 1;
    // Add more education fields dynamically
    (_a = document.getElementById('add-education')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        var newEducation = document.createElement('div');
        newEducation.className = 'education-entry';
        newEducation.innerHTML = "\n            <label for=\"degree-".concat(educationIndex, "\">Degree:</label>\n            <input type=\"text\" id=\"degree-").concat(educationIndex, "\" name=\"degree[]\" required>\n            <label for=\"institution-").concat(educationIndex, "\">Institution:</label>\n            <input type=\"text\" id=\"institution-").concat(educationIndex, "\" name=\"institution[]\" required>\n            <label for=\"year-").concat(educationIndex, "\">Year:</label>\n            <input type=\"text\" id=\"year-").concat(educationIndex, "\" name=\"year[]\" required>\n        ");
        educationSection.appendChild(newEducation);
        educationIndex++;
    });
    // Add more work experience fields dynamically
    (_b = document.getElementById('add-work')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
        var newWork = document.createElement('div');
        newWork.className = 'work-entry';
        newWork.innerHTML = "\n            <label for=\"job-title-".concat(workIndex, "\">Job Title:</label>\n            <input type=\"text\" id=\"job-title-").concat(workIndex, "\" name=\"jobTitle[]\" required>\n            <label for=\"company-").concat(workIndex, "\">Company:</label>\n            <input type=\"text\" id=\"company-").concat(workIndex, "\" name=\"company[]\" required>\n            <label for=\"work-year-").concat(workIndex, "\">Year:</label>\n            <input type=\"text\" id=\"work-year-").concat(workIndex, "\" name=\"workYear[]\" required>\n            <label for=\"description-").concat(workIndex, "\">Description:</label>\n            <textarea id=\"description-").concat(workIndex, "\" name=\"description[]\" required></textarea>\n        ");
        workSection.appendChild(newWork);
        workIndex++;
    });
    // Add more skill fields dynamically
    (_c = document.getElementById('add-skill')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
        var newSkill = document.createElement('input');
        newSkill.type = 'text';
        newSkill.id = "skill-".concat(skillIndex);
        newSkill.name = 'skills[]';
        newSkill.required = true;
        skillsSection.appendChild(newSkill);
        skillIndex++;
    });
    // Generate Resume
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var formData = new FormData(form);
        var data = formDataToObject(formData);
        // Handle Image Upload
        var pictureInput = document.getElementById('picture');
        var reader = new FileReader();
        reader.onload = function (event) {
            var _a;
            var pictureUrl = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
            renderResume(data, pictureUrl);
        };
        if (pictureInput.files && pictureInput.files[0]) {
            reader.readAsDataURL(pictureInput.files[0]);
        }
        else {
            renderResume(data, ''); // If no picture, render without image
        }
    });
    function formDataToObject(formData) {
        var data = {};
        formData.forEach(function (value, key) {
            if (!data[key]) {
                data[key] = value;
            }
            else {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                }
                else {
                    data[key] = [data[key], value];
                }
            }
        });
        return data;
    }
    function renderResume(data, pictureUrl) {
        var username = data.username || 'user'; // Ensure you have the username
        var uniqueUrl = generateUniqueUrl(username);
        resumeOutput.innerHTML = "\n<div class=\"resume-wrapper\">\n        <!-- Sidebar -->\n        <aside class=\"sidebar\">\n            ".concat(pictureUrl ? "<img src=\"".concat(pictureUrl, "\" alt=\"Profile Picture\" class=\"profile-picture\">") : '', "\n            <h1 class=\"name\">").concat(data.name, "</h1>\n            <p class=\"contact\">").concat(data.email, "</p>\n            <p class=\"contact\">+92 ").concat(data.phone, "</p>\n            <button id=\"toggle-skills-btn\">Toggle Skills</button>\n        </aside>\n\n        <!-- Main Content -->\n        <main class=\"content\">\n            <!-- Education -->\n            <section id=\"education\" contenteditable=\"true\">\n                <h2>Education</h2>\n                <div class=\"section-content\">\n                    ").concat(generateEducationHTML(data), "\n                </div>\n            </section>\n\n            <!-- Skills -->\n            <section id=\"skills\" contenteditable=\"true\">\n                <h2>Skills</h2>\n                <div class=\"section-content\">\n                    ").concat(generateSkillsHTML(data), "\n                </div>\n            </section>\n\n            <!-- Work Experience -->\n            <section id=\"work-experience\" contenteditable=\"true\">\n                <h2>Work Experience</h2>\n                <div class=\"section-content\">\n                    ").concat(generateWorkHTML(data), "\n                </div>\n            </section>\n        </main>\n\n       \n    </div>\n     <!-- Action Buttons -->\n        <div class=\"actions\">\n            <button id=\"download-btn\">Download as PDF</button>\n            <br>\n            <button id=\"share-btn\">Share Resume</button>\n            \n        </div>\n    \n    ");
        resumeOutput.style.display = 'block';
        addToggleSkillsListener(); // Add listener for toggling skills
        makeEditable(); // Make the sections editable
        addDownloadButtonListener(); // Add listener for downloading PDF
        addShareButtonListener(uniqueUrl); // Add listener for sharing URL
    }
    function generateUniqueUrl(username) {
        return "https://".concat(username, ".vercel.app/resume");
    }
    function addDownloadButtonListener() {
        var downloadBtn = document.getElementById('download-btn');
        var resumeContent = document.querySelector('.resume-wrapper');
        if (downloadBtn && resumeContent) {
            downloadBtn.addEventListener('click', function () {
                html2pdf().from(resumeContent).save('resume.pdf');
            });
        }
    }
    function addShareButtonListener(url) {
        var shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function () {
                navigator.clipboard.writeText(url).then(function () {
                    alert('Resume link copied to clipboard!');
                }).catch(function (err) {
                    console.error('Failed to copy link: ', err);
                });
            });
        }
    }
    function addToggleSkillsListener() {
        var toggleSkillsBtn = document.getElementById('toggle-skills-btn');
        var skillsSection = document.getElementById('skills');
        if (toggleSkillsBtn && skillsSection) {
            toggleSkillsBtn.addEventListener('click', function () {
                if (skillsSection.style.display === 'none') {
                    skillsSection.style.display = 'block';
                }
                else {
                    skillsSection.style.display = 'none';
                }
            });
        }
    }
    function makeEditable() {
        var editableSections = document.querySelectorAll('[contenteditable="true"]');
        editableSections.forEach(function (section) {
            section.addEventListener('input', function () {
                // Here, you can implement the logic to save data when editing is done
                // For now, we're assuming the user changes are directly reflected
                console.log("Section edited: ".concat(section.id));
            });
        });
    }
    function generateEducationHTML(data) {
        var degrees = data['degree[]'] || [];
        var institutions = data['institution[]'] || [];
        var years = data['year[]'] || [];
        if (!Array.isArray(degrees)) {
            return "<div class=\"education-item\">\n                        <h3>".concat(degrees, "</h3>\n                        <p>").concat(institutions, " (").concat(years, ")</p>\n                    </div>");
        }
        return degrees.map(function (degree, index) { return "\n                    <div class=\"education-item\">\n                        <h3>".concat(degree, "</h3>\n                        <p>").concat(institutions[index], " (").concat(years[index], ")</p>\n                    </div>\n            "); }).join('');
    }
    function generateWorkHTML(data) {
        var jobTitles = data['jobTitle[]'] || [];
        var companies = data['company[]'] || [];
        var workYears = data['workYear[]'] || [];
        var descriptions = data['description[]'] || [];
        if (!Array.isArray(jobTitles)) {
            return "<div class=\"work-item\">\n                        <h3>".concat(jobTitles, "</h3>\n                        <p>").concat(companies, " (").concat(workYears, ")</p>\n                        <p>").concat(descriptions, "</p>\n                    </div>");
        }
        return jobTitles.map(function (jobTitle, index) { return "\n                    <div class=\"work-item\">\n                        <h3>".concat(jobTitle, "</h3>\n                        <p>").concat(companies[index], " (").concat(workYears[index], ")</p>\n                        <p>").concat(descriptions[index], "</p>\n                    </div>\n        "); }).join('');
    }
    function generateSkillsHTML(data) {
        var skills = data['skills[]'] || [];
        if (!Array.isArray(skills)) {
            return "<p class=\"skill-badge\">".concat(skills, "</p>");
        }
        return skills.map(function (skill) { return "\n                    <p class=\"skill-badge\">".concat(skill, "</p>"); }).join('');
    }
});
