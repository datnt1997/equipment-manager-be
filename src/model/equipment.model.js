const EQUIPMENT_STATUS = require('../constant');
class Equipment {
  constructor({ name = '', description = '', status = EQUIPMENT_STATUS.AVAILABLE, userID = null } = {}) {
    this.name = name,
      this.description = description,
      this.status = status,
      this.userID = userID
  }

  toJson() {
    return { name: this.name, description: this.description, status: this.status, userID: this.userID }
  }
}

module.exports = Equipment