const EquipmentsDAO = require('../dao/equipmentsDAO');
const ResponseModel = require('../model/response.model');
const UserModel = require('../model/user.model');
const EquipmentModel = require('../model/equipment.model');

class EquipmentsController {
  static async createEquipment(req, res) {
    try {
      try {
        const userJwt = req.get("Authorization")?.slice("Bearer ".length)
        const user = await UserModel.decoded(userJwt)
        var { error, isAdmin } = user
        if (error || !isAdmin) {
          let response = new ResponseModel({
            errors: error ? [error] : ['You do not have permission to do this'],
            status: 401,
            successful: false
          });
          res.status(401).json(response.toJson())
          return
        }
      } catch (e) {
        let response = new ResponseModel({
          errors: ['Can not authorization'],
          status: 401,
          successful: false
        });
        res.status(401).json(response.toJson());
        return
      }
      const equipmentFromBody = req.body
      let errors = [];
      if (!equipmentFromBody.name) {
        errors.push({ name: 'This field is required!' });
      }
      if (errors.length) {
        let response = new ResponseModel({
          errors,
          status: 400,
          successful: false
        });
        res.status(400).json(response.toJson())
        return
      }

      const equipment = new EquipmentModel({...equipmentFromBody});
      const insertResult = await EquipmentsDAO.addEquipment(equipment);
      if (!insertResult.success) {
        errors.push(insertResult.error);
      }
      if (errors.length) {
        let response = new ResponseModel({
          errors,
          status: 400,
          successful: false
        });
        res.status(400).json(response.toJson())
        return
      }

      let response = new ResponseModel({});
      res.status(200).json(response.toJson());

    } catch (e) {
      let response = new ResponseModel({
        errors: [e],
        status: 500,
        successful: false
      });
      res.status(500).json(response.toJson())
    }
  }
}

module.exports = EquipmentsController;