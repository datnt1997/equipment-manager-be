const EQUIPMENT_STATUS = require('../constant');
class Equipment {
  constructor({ name = '', description = '', status = EQUIPMENT_STATUS.AVAILABLE } = {}) {
    this.name = name,
      this.description = description,
      this.status = status
  }
  toJson() {
    return { name: this.name, description: this.description, status: this.status }
  }
}

module.exports = Equipment