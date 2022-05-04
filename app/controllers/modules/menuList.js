const Mess = require('../../models/mess');
const CurrentMenu = require('../../models/currentMenus');

exports.getMyMenus = async(req, res) => {
    await Mess.findById({
            _id: req.params.messid
        }).exec()
        .then(doc => {
            res.status(200).json({
                messsage: "success",
                Mess: doc.MenuList
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                error: err
            })
        })
}

exports.getMenuById = async(req, res) => {
    await Mess.findById({
            _id: req.params.messid
        }).select('MenuList')
        .then(doc => {
            let menuArray = doc.MenuList;
            let index = menuArray.findIndex(menu => {
                return String(menu._id) === String(req.params.menuid);
            })

            res.status(200).json({
                message: "success",
                menu: menuArray[index]
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                error: err
            })
        })
}

exports.addNewMenu = async(req, res) => {
    let originalMenuList = [];
    let newMenu = req.body;

    //fetch document by id
    await Mess.findById({ _id: req.params.messid })
        .exec()
        .then(doc => {
            console.log(doc);
            originalMenuList = doc.MenuList;
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while updating data",
                error: err
            })
        })

    //push new menu to the original array
    originalMenuList.push(newMenu);

    //update the document
    await Mess.findByIdAndUpdate(req.params.messid, { MenuList: originalMenuList }, (err, doc) => {
        if (err) {
            res.status(500).json({
                message: "some error occured while updating data",
                error: err
            })
        } else if (doc) {
            res.status(200).json({
                message: "success",
                doc: doc
            })
        }
    })
}

exports.updateMenuById = async(req, res) => {
    let menuArray = []
    await Mess.findById({
        _id: req.params.messid
    }).then(doc => {
        menuArray = doc.MenuList
    })
    let ind = menuArray.findIndex(menu => {
        console.log(menu._id)
        return String(menu._id) === String(req.params.menuid)
    })
    menuArray.splice(ind, 1, req.body)
    await Mess.findByIdAndUpdate({ _id: req.params.messid }, { MenuList: menuArray })
        .then(doc => {
            res.status(200).json({
                message: "success",
                doc: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while updating data",
                error: err
            })
        })
}

exports.deleteMenuById = async(req, res) => {
    let menuArray = []
    let postsArray = []
    await Mess.findById({ _id: req.params.messid })
        .then(doc => {
            menuArray = doc.MenuList
            postsArray = doc.postedMenu
            console.log(doc.postedMenu)
        })
        .catch(err => {
            console.log("here")
            res.status(500).json({
                message: "some error occured while removing data",
                error: err
            })
        })


    let ind = menuArray.findIndex(menu => {
        console.log(menu._id)
        return String(menu._id) === String(req.params.menuid)
    })
    menuArray.splice(ind, 1)

    //inconsistency removal
    try {
        for (let i = 0; i < postsArray.length; i++) {
            removeDocFromCurrentMenuIfMenuFound(postsArray[i].postId, req.params.menuid)
        }
    } catch (err) {
        console.log(err)
    }



    //final update
    await Mess.findByIdAndUpdate({ _id: req.params.messid }, { MenuList: menuArray })
        .then(doc => {
            res.status(200).json({
                message: "success",
                doc: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while updating data",
                error: err
            })
        })
}

async function removeDocFromCurrentMenuIfMenuFound(postId, menuId) {
    await CurrentMenu.findById({ _id: postId })
        .then(doc => {
            if (String(doc.menuId) === String(menuId))
                var messId = doc.messId
            CurrentMenu.findByIdAndDelete({ _id: postId })
                .then(doc => {
                    console.log(doc);
                    removePostFromMessDoc(postId, messId)
                }).catch(err => {
                    throw new Error(err)
                })
        })
        .catch(err => {
            throw new Error(err)
        })
}

async function removePostFromMessDoc(postId, messId) {
    let pMenu = []
    await Mess.findById({ _id: messId })
        .then(doc => {
            pMenu = doc.postedMenu;
        })
        .catch(err => {
            throw new Error(err)
        })

    let ind = pMenu.findIndex(post => {
        return String(post.postId) === String(postId)
    })
    pMenu.splice(ind, 1);

    await Mess.findByIdAndUpdate({ _id: messId }, { postedMenu: pMenu })
        .then(doc => {
            console.log(doc)
        })
        .catch(err => {
            throw new Error(err)
        })
}