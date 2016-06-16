import {StyleSheet} from 'react-native';

let style = StyleSheet.create({
    dateTouch: {
        width: 142
    },
    fakeInput: {
        height: 32,
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 0,
        borderBottomColor: 'hsl(210, 13%, 91%)',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 15
    },
    fakeInputText: {
        color: 'white',
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 14
    },
    fakeInputIcon: {
        position: 'absolute',
        top: 1,
        right: 0,
        width: 24,
        height: 24
    },
    datePickerMask: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    datePickerCon: {
        backgroundColor: '#fff',
        height: 0,
        overflow: 'hidden'
    },
    btnText: {
        position: 'absolute',
        top: 0,
        height: 42,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTextConfirm: {
        fontSize: 16,
        color: 'hsl(212, 100%, 51%)'
    },
    btnTextCancel: {
        color: 'hsl(212, 100%, 51%)'
    },
    btnCancel: {
        left: 0
    },
    btnConfirm: {
        right: 0
    },
    datePicker: {
        alignItems: 'center',
        marginTop: 42,
        borderTopColor: 'hsl(210, 13%, 91%)',
        borderTopWidth: StyleSheet.hairlineWidth
    },
    disabled: {
        backgroundColor: '#eee'
    }
});

export default style;
