class Task {
	constructor(data) {
		this.id = data.id;
		this.title = data.title;
		this.description = data.description || '';
		this.completed = data.completed || false;
		this.priority = data.priority || 'medium';
		this.userId = data.userId;
		this.createdAt = data.createdAt;
	}

	validate() {
		const errors = [];
		if (!this.title?.trim()) errors.push('Titulo e obrigatorio');
		if (!this.userId) errors.push('Usuario e obrigatorio');
		return { isValid: errors.length === 0, errors };
	}

	toJSON() {
		return { ...this };
	}
}

module.exports = Task;
