QUnit.testStart(function(details){
    var data = [
        {'uid': 0, 'type': 'folder', 'name': 'first_folder', 'parent_uid': 'null'}
//        {'uid': 3, 'type': 'folder', 'name': 'soccer_players', 'parent_uid': 'null'},
//        {'uid': 4, 'type': 'folder', 'name': 'pro', 'parent_uid': 3},
//        {'uid': 7, 'type': 'folder', 'name': 'regular', 'parent_uid': 3},
//        {'uid': 10, 'type': 'folder', 'name': 'bad', 'parent_uid': 7},
//        {'uid': 1, 'type': 'file', 'name': 'tony', 'parent_uid': 0},
//        {'uid': 2, 'type': 'file', 'name': 'bucky', 'parent_uid': 0},
//        {'uid': 5, 'type': 'file', 'name': 'ronaldo', 'parent_uid': 4},
//        {'uid': 6, 'type': 'file', 'name': 'messi', 'parent_uid': 4},
//        {'uid': 8, 'type': 'file', 'name': 'jake', 'parent_uid': 7},
//        {'uid': 9, 'type': 'file', 'name': 'robert', 'parent_uid': 7},
//        {'uid': 11, 'type': 'file', 'name': 'joe', 'parent_uid': 10}
    ];

    myGrid = HGrid.create({
        container: "#myGrid",
        info: data,
        breadcrumbBox: "#myGridBreadcrumbs",
        dropZone: true,
        url: '/',
    });

    referenceItem = myGrid.data[0];
});

QUnit.testDone(function(details){
    myGrid.destroy();
});

test("Create", function() {
    ok( myGrid, "Grid created");
});

test("Data Length", function(){
    ok(_.isEqual(
        myGrid.data.length,
        1
    ), "Length of data is correct");
});

test("getItemByValue", function(){

    ok(_.isEqual(
        myGrid.getItemByValue(myGrid.data, referenceItem['uid'], "uid"),
        referenceItem
    ), "Find by uid");

    ok(_.isEqual(
        myGrid.getItemByValue(myGrid.data, referenceItem['id'], "id"),
        referenceItem
    ), "Find by id");

    ok(_.isEqual(myGrid.getItemByValue(myGrid.data, referenceItem['name'], "name"),
        referenceItem
    ), "Find by name");
});

test("getItemsByValue", function(){
    var item1 = {'uid': 1, 'type': 'file', 'name': 'first_child', 'parent_uid': 0};
    var item2 = {'uid': 2, 'type': 'file', 'name': 'second_child', 'parent_uid': 0};
    var item3 = {'uid': 3, 'type': 'folder', 'name': 'second_folder', 'parent_uid': 'null'};
    myGrid.addItem(item1);
    myGrid.addItem(item2);
    myGrid.addItem(item3);

    ok(_.isEqual(
        $(myGrid.getItemsByValue(myGrid.data, referenceItem['uid'], "parent_uid"))
        .map(function(idx, elm){ return elm['uid'] }).get().sort(),
        [item1['uid'], item2['uid']]
    ), "Find children by parent_uid, compare sorted lists");

    ok(_.isEqual(
        $(myGrid.getItemsByValue(myGrid.data, "folder", "type"))
        .map(function(idx, elm){ return elm['uid'] }).get().sort(),
        [referenceItem['uid'], item3['uid']]
    ), "Find all folders, compare sorted lists");
});

test("addColumn", function(){
    var newColumn = {id:'id', name:'id', field:'id'};
    myGrid.addColumn(newColumn);
    var columns = myGrid.Slick.grid.getColumns();
    ok(_.isEqual(
        columns[columns.length-1]['id'],
        newColumn['id']
    ), "IDs of the columns are the same");
});

test("addItem", function(){
    var item = {'uid': 1, 'type': 'file', 'name': 'first_child', 'parent_uid': 0};
    myGrid.addItem(item);

    ok(_.isEqual(
        myGrid.getItemByValue(myGrid.data, item['uid'], "uid"),
        item
    ), "Item with correct uid is in data");
});

test("deleteItems", function(){
    var item1 = {'uid': 1, 'type': 'file', 'name': 'first_child', 'parent_uid': 0};
    var item2 = {'uid': 2, 'type': 'file', 'name': 'second_child', 'parent_uid': 0};
    var item3 = {'uid': 3, 'type': 'folder', 'name': 'second_folder', 'parent_uid': 'null'};
    myGrid.addItem(item1);
    myGrid.addItem(item2);
    myGrid.addItem(item3);
    myGrid.deleteItems([item1['uid']]);

    ok(_.isEqual(
        myGrid.getItemByValue(myGrid.data, item1['uid'], "uid"),
        false
    ), "Item deleted is not found in grid")

    myGrid.deleteItems([referenceItem['uid']]);

    ok(_.isEqual(
        myGrid.getItemByValue(myGrid.data, item2['uid'], "uid") || myGrid.getItemByValue(myGrid.data, referenceItem['uid'], "uid"),
        false
    ), "Folder deleted as well as child");

    ok(myGrid.getItemByValue(myGrid.data, item3['uid'], "uid"), "Undeleted item still in grid");
});

test("editItem", function(){
    myGrid.editItem(referenceItem['uid'], "name", "new_name");

    ok(_.isEqual(
        referenceItem['name'],
        "new_name"
    ), "Item's property changed");

    ok(_.isEqual(
        myGrid.getItemByValue(myGrid.data, referenceItem['uid'], "uid")['name'],
        "new_name"
    ), "Property changed in data");
});

test("moveItems", function(){
    var item1 = {'uid': 1, 'type': 'file', 'name': 'first_child', 'parent_uid': 0};
    var item2 = {'uid': 2, 'type': 'file', 'name': 'second_child', 'parent_uid': 0};
    var item3 = {'uid': 3, 'type': 'folder', 'name': 'second_folder', 'parent_uid': 'null'};
    myGrid.addItem(item1);
    myGrid.addItem(item2);
    myGrid.addItem(item3);

    myGrid.moveItems([0], 3);

    ok(_.isEqual(item1['parent_uid'], referenceItem['uid']), "Child 1 still has correct parent_uid");
    ok(_.isEqual(item2['parent_uid'], referenceItem['uid']), "Child 2 still has correct parent_uid");
    ok(_.isEqual(referenceItem['parent_uid'], item3['parent_uid']), "Moved item now has destination uid as parent_uid");
});

