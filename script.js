fetch('/projects.json')
	.then(response => response.json())
	.then(data => insertProjectsToHTML(data.projects))
	.catch(error => console.error('Error:', error));

const insertProjectsToHTML = (projects) => {
	let html = '';

	projects.sort(sortProjects);

	projects.forEach(project => {
		html += getProjectHtml(project);
	});

	document.getElementById('projects-container').innerHTML = html;
}

const sortProjects = (a, b) => {
	const aFeatured = a.featured || false;
	const bFeatured = b.featured || false;

	if (aFeatured === bFeatured) {
		const aEndDate = a.endDate || new Date().toISOString();
		const bEndDate = b.endDate || new Date().toISOString();
		return new Date(bEndDate) - new Date(aEndDate);
	}
	return bFeatured - aFeatured;
}

const getProjectHtml = (project) => {
	let html = `<h2>${project.title}</h2>`;
	html += `<p class="text-muted">${getReadableDate(project.startDate)} - ${getReadableDate(project.endDate)}</p>`;

	if (project.websiteUrl) {
		html += `<a href="${project.websiteUrl}">Website</a> `;
	}

	if (project.githubUrl) {
		html += `<a href="${project.githubUrl}">Github</a> `;
	}

	if (project.youtubeUrl) {
		html += `<a href="${project.youtubeUrl}">Youtube</a>`;
	}

	html += `<p>${project.description}</p>`;

	project.images.forEach(image => {
		html += `<img src="${image}" alt="${project.title} image">`;
	});

	html += `<hr/>`;

	return html;
}

const getReadableDate = (dateString) => {
	if (dateString) {
		const date = new Date(dateString);
		const options = { year: 'numeric', month: 'short' };
		return date.toLocaleString('default', options);
	} else {
		return "Present";
	}
}