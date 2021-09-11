const { Router } = require("express");
const equipmentCtrl = require ("../controller/equipments.controller")

const router = new Router()

// associate put, delete, and get(id)
router.route("/create").post(equipmentCtrl.createAEquipment)
router.route("/update").put(equipmentCtrl.updateAEquipment)
router.route("/update-status").put(equipmentCtrl.updateStatusEquipment)
router.route("/book-a-equipment").put(equipmentCtrl.bookAEquipment)
router.route("/return-a-equipment").put(equipmentCtrl.returnAEquipment)
router.route("/delete").delete(equipmentCtrl.deleteAEquipment)
router.route("/my-equipments").get(equipmentCtrl.getMyEquipments)
router.route("/get-all").get(equipmentCtrl.getAllEquipments)
router.route("/:id").get(equipmentCtrl.getEquipmentsByID)

module.exports = router;
