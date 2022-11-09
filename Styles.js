import { StyleSheet } from "react-native";

// Styles for the 'CurrentList' screen. Will merge with CreateList screen's styles soon. (Daniel)
const styles = StyleSheet.create({
    // Text styles
    boldMediumWhite: {
        fontSize: 15, 
        textAlign: 'center', 
        fontWeight: 'bold',
        color: 'white',
    },
    boldMediumBlack: {
        fontSize: 15, 
        textAlign: 'center', 
        fontWeight: 'bold',
        color: 'black',
    },
    productName: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        flexWrap: 'wrap',
        fontFamily: 'notoserif',
    },
    interactable: {
        color: 'blue',
        borderColor: 'blue',
        borderBottomWidth: 1, 
    },
    shadow: {
        textShadowColor: 'black',
        textShadowRadius: 2, 
    },
    lightText: {
        color: 'burlywood',
        fontWeight: 'bold'
    },
    darkText: {
        color: 'black',
        fontWeight: 'bold'
    },

    // Buttons
    whiteBtn: {
        borderRadius: 5,
        borderWidth: 1, 
        borderColor: 'orange', 
        backgroundColor: 'white', 
        padding: 5,
        marginHorizontal: 5, 
    },
    orangeBtn: { 
        backgroundColor: 'orange', 
        margin: 5, 
    },
    grayBtn: {
        borderColor: 'lightgray', 
        backgroundColor: 'lightgray', 
        margin: 5, 
    },
    checkoutButton: {
        flex: 0,
        paddingVertical: 10,
        width: '30%',
        marginTop: 10,
    },

    // Positioning & Spacing
    centerItems: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    isColumn: {
        flexDirection: 'column', 
    },
    isRow: {
        flexDirection: 'row', 
    },

    horizontalSpacer: {
        marginHorizontal: 10,
    },
    verticalSpacer: {
        marginVertical: 10,
    },
    allAroundSpacer: {
        margin: 5,
    },
    storeSpacing: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignContent: 'center'
    },
    productContainer: {
        flex: 9,
    },
    mediumPadding: {
        padding: 20,
    },

    // Customized stuff
    storeModalTitle: {
        margin: 0, 
        borderBottomWidth: 0, 
        borderBottomLeftRadius: 0, 
        borderBottomRightRadius: 0,
    },
    selectStoreList: {
        flexGrow: 0, 
        marginHorizontal: 0,
        borderTopLeftRadius: 0, 
        borderTopRightRadius: 0, 
        borderTopColor: '', 
        borderTopWidth: 0
    },
    dealsView: {
        flex: 0,
        borderRadius: 2, 
        padding: 5, 
        marginTop: 25, 
    },
    productTile: {
        width: '100%',
        height: 250,
        marginVertical: 8,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',

        backgroundColor: 'white',
    },
    productImg: {
        flex: 5,
        width: 180,
        height: 180,
        marginTop: 5,
    },
    productImgLg: {
        width: 350,
        height: 350,
        padding: 30,
    },
    customQtyBtn: {
        marginRight: 5, 
        marginLeft: 10,
        color: 'black',
    },
    dropDownMenu: {
        width: 60, 
        borderColor: 'orange', 
        borderWidth: 1
    },
    categoryContainer: {
        flex: 1,
    },
    categoryButton: {
        flex: 0,
        width: 120,
        padding: 15,
        backgroundColor: 'orange',
    },
    continueButton: {
        flex: 0,
        borderRadius: 5,
        width: '30%',
        padding: 10,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productInfo: {
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    tag: {
        flexDirection: 'row', 
        backgroundColor: 'gold', 
        margin: 2, 
        padding: 3, 
        borderRadius: 5, 
        borderWidth: 1, 
        borderColor: 'black',
    }
});

export default styles;