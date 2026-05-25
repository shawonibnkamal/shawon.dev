const loadProjects = () => {
	fetch('projects.json')
		.then(response => response.json())
		.then(data => insertProjectsToHTML(data.projects))
		.catch(error => {
			console.error('Error:', error);
			document.getElementById('projects-container').innerHTML = '<p>Could not load portfolio.</p>';
		});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', loadProjects);
} else {
	loadProjects();
}

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
	const projectLinks = getProjectLinks(project);

	if (projectLinks.length) {
		html += `<div class="project-links">`;
		projectLinks.forEach(link => {
			html += `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`;
		});
		html += `</div>`;
	}

	if (project.description) {
		html += `<p>${project.description}</p>`;
	}

	if (project.mentions) {
		html += `<div class="project-mentions">`;
		html += `<h3>Mentions</h3>`;
		html += `<ul>`;

		project.mentions.forEach(mention => {
			html += `<li>`;
			html += `<a href="${mention.url}" target="_blank" rel="noopener">${mention.label}</a>`;

			if (mention.source) {
				html += `<span>${mention.source}</span>`;
			}

			if (mention.description) {
				html += `<p>${mention.description}</p>`;
			}

			html += `</li>`;
		});

		html += `</ul>`;
		html += `</div>`;
	}

	(project.images || []).forEach(image => {
		html += `<img src="${image}" alt="${project.title} image">`;
	});

	html += `<hr/>`;

	return html;
}

const getProjectLinks = (project) => {
	const links = [];

	if (project.websiteUrl) {
		links.push({ label: 'Website', url: project.websiteUrl });
	}

	if (project.githubUrl) {
		links.push({ label: 'Github', url: project.githubUrl });
	}

	if (project.youtubeUrl) {
		links.push({ label: 'Youtube', url: project.youtubeUrl });
	}

	return links.concat(project.links || []);
}

const getReadableDate = (dateString) => {
	if (dateString) {
		const [year, month] = dateString.split('-').map(Number);
		const date = new Date(year, month - 1);
		const options = { year: 'numeric', month: 'short' };
		return date.toLocaleString('default', options);
	} else {
		return "Present";
	}
}
