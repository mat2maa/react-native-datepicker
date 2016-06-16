'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Modal,
    TouchableWithoutFeedback,
    TouchableHighlight,
    DatePickerAndroid,
    TimePickerAndroid,
    DatePickerIOS,
    Platform,
    Animated
} from 'react-native';
import Style from './style';
import Moment from 'moment';

const FORMATS = {
    'date': 'YYYY-MM-DD',
    'datetime': 'YYYY-MM-DD HH:mm',
    'time': 'HH:mm'
};

const CALENDAR_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAAAM1BMVEUAAAD///////////////////////////////////////////////////////////////+3leKCAAAAEHRSTlMAECAwQFBgcICPn6+/z9/vIxqCigAAAr1JREFUeAHt2E2u6ygQgFFwiEMc/9T+V9vT7skVvHBbeuZ8K0BHuLAqSdI8LfWnFif6dyV+qjgRLFjjgwULFixYsGDBgtUcLFiwYMGCBQsWLFiwYMGCBQsWLFiwYJWy1v+2xU9t9f+t/0Rr+Q2+Zf2ccc/ObV0GSuX1iHt3rHkQVb3i/l11BFe9Yo6u17dUjyPm6Xh8ZfWKuXp9YbXFbG1/SpX3mK89/xnWETN2ZN9ge5/UX41Ze3dblZi3Z6dVvmLermxg/dbYesTclR6sPebuMN07KiZWe3uzVQ4trVhr6N2K9QkdrVihiKX9LdSzfT2q2r5v0N7++66jA0uwhmNd0RysECxYsGDBgiVYsGDBggVLsGDBggULlmDBggULFizBggULFixYggULFixYsAQLFixYsGBpENa536fzt7Fquk8VFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYQ6oxqAoLFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYE2AtZVDLBFjjgwULFixYsGDBggULFixYsGDBggULFixYsGDBggULFixYsGDNiXXu9+kchSVYw7HOiNDZhrVHhPY2rHdE6N2GtYYi1jasRyhiSW2doTM1toXerVgl9EitneErbG4Nb2Fz+XKx2ltdrI6OmLkjdVU8hR3VmLfarGT38End5SPm7Mipv8fFql+LVUv5YNVe/sRcbTl90euKebqe6buWj2vVUdljhvaShvTYrrh317akcT23M+7auT3T6HJ51fv1Kjn9NUn6BygVcM+dUZ7TAAAAAElFTkSuQmCC';

class DatePicker extends Component {

    constructor(props) {
        super(props);

        this.datePicked = this.datePicked.bind(this);
        this.onPressDate = this.onPressDate.bind(this);
        this.onPressCancel = this.onPressCancel.bind(this);
        this.onPressConfirm = this.onPressConfirm.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
    }

    format = this.props.format;
    mode = this.props.mode || 'date';
    height = 259;
    // slide animation duration time, default to 300ms, IOS only
    duration = this.props.duration || 300;

    confirmBtnText = this.props.confirmBtnText || 'OK';
    cancelBtnText = this.props.cancelBtnText || 'Cancel';

    iconSource = this.props.iconSource || {uri: CALENDAR_ICON};
    customStyles = this.props.customStyles || {};

    state = {
        date: this.getDate(),
        modalVisible: false,
        disabled: this.props.disabled,
        animatedHeight: new Animated.Value(0)
    };

    componentWillMount() {
        // ignore the warning of Failed propType for date of DatePickerIOS, will remove after being fixed by official
        console.ignoredYellowBox = [
            'Warning: Failed propType'
            // Other warnings you don't want like 'jsSchedulingOverhead',
        ];

        // init format according to mode
        if (!this.format) {
            this.format = FORMATS[this.mode];
        }
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});

        // slide animation
        if (visible) {
            Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: this.height,
                    duration: this.duration
                }
            ).start();
        } else {
            this.setState({
                animatedHeight: new Animated.Value(0)
            })
        }
    }

    onPressCancel() {
        this.setModalVisible(false);
    }

    onPressConfirm() {
        this.datePicked();
        this.setModalVisible(false);
    }

    getDate(date = this.props.date) {
        if (date instanceof Date) {
            return date;
        } else {
            return Moment(date, this.format).toDate();
        }
    }

    getDateStr(date = this.props.date) {
        if (date instanceof Date) {
            return Moment(date).format(this.format);
        } else {
            return Moment(this.getDate(date)).format(this.format);
        }
    }

    datePicked() {
        if (typeof this.props.onDateChange === 'function') {
            this.props.onDateChange(this.getDateStr(this.state.date))
        }
    }

    onPressDate() {
        if (this.state.disabled) {
            return true;
        }

        // reset state
        this.setState({
            date: this.getDate()
        });

        if (Platform.OS === 'ios') {
            this.setModalVisible(true);
        } else {

            // 选日期
            if (this.mode === 'date') {
                DatePickerAndroid.open({
                    date: this.state.date,
                    minDate: this.props.minDate && this.getDate(this.props.minDate),
                    maxDate: this.props.maxDate && this.getDate(this.props.maxDate)
                }).then(({action, year, month, day}) => {
                    if (action !== DatePickerAndroid.dismissedAction) {
                        this.setState({
                            date: new Date(year, month, day)
                        });
                        this.datePicked();
                    }
                });
            } else if (this.mode === 'time') {
                // 选时间

                let timeMoment = Moment(this.state.date);

                TimePickerAndroid.open({
                    hour: timeMoment.hour(),
                    minute: timeMoment.minutes(),
                    is24Hour: !this.format.match(/h|a/)
                }).then(({action, hour, minute}) => {
                    if (action !== DatePickerAndroid.dismissedAction) {
                        console.log(Moment().hour(hour).minute(minute).toDate());
                        this.setState({
                            date: Moment().hour(hour).minute(minute).toDate()
                        });
                        this.datePicked();
                    }
                });
            } else if (this.mode === 'datetime') {
                // 选日期和时间

                DatePickerAndroid.open({
                    date: this.state.date,
                    minDate: this.props.minDate && this.getDate(this.props.minDate),
                    maxDate: this.props.maxDate && this.getDate(this.props.maxDate)
                }).then(({action, year, month, day}) => {
                    if (action !== DatePickerAndroid.dismissedAction) {
                        let timeMoment = Moment(this.state.date);

                        TimePickerAndroid.open({
                            hour: timeMoment.hour(),
                            minute: timeMoment.minutes(),
                            is24Hour: !this.format.match(/h|a/)
                        }).then(({action, hour, minute}) => {
                            if (action !== DatePickerAndroid.dismissedAction) {
                                this.setState({
                                    date: new Date(year, month, day, hour, minute)
                                });
                                this.datePicked();
                            }
                        });
                    }
                });
            } else {
                new Error('The specified mode is not supported');
            }
        }
    }

    render() {

        return (
            <TouchableWithoutFeedback
                style={[Style.dateTouch, this.props.style]}
                onPress={this.onPressDate}
            >
                <View style={[Style.fakeInput, this.customStyles.fakeInput]}>
                    <Text style={[Style.fakeInputText, this.customStyles.fakeInputText]}>
                        {this.getDateStr()}
                    </Text>

                    <Image
                        style={[Style.fakeInputIcon, this.customStyles.fakeInputIcon]}
                        source={this.iconSource}
                    />

                    {
                        // DatePickerIOS
                        Platform.OS === 'ios' && <Modal
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {this.setModalVisible(false)}}
                        >
                            <TouchableHighlight
                                style={Style.datePickerMask}
                                activeOpacity={1}
                                underlayColor={'#00000077'}
                                onPress={this.onPressCancel}
                            >
                                <TouchableHighlight
                                    underlayColor={'#fff'}
                                    style={{flex:1}}
                                >
                                    <Animated.View
                                        style={[Style.datePickerCon, {height: this.state.animatedHeight}, this.customStyles.datePickerCon]}>
                                        <DatePickerIOS
                                            date={this.state.date}
                                            mode={this.mode}
                                            minimumDate={this.props.minDate && this.getDate(this.props.minDate)}
                                            maximumDate={this.props.maxDate && this.getDate(this.props.maxDate)}
                                            onDateChange={(date) => this.setState({date: date})}
                                            style={[Style.datePicker, this.customStyles.datePicker]}
                                        />
                                        <TouchableHighlight
                                            underlayColor={'transparent'}
                                            onPress={this.onPressCancel}
                                            style={[Style.btnText, Style.btnCancel, this.customStyles.btnCancel]}
                                        >
                                            <Text
                                                style={[Style.btnTextText, Style.btnTextCancel, this.customStyles.btnTextCancel]}>{this.cancelBtnText}</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            underlayColor={'transparent'}
                                            onPress={this.onPressConfirm}
                                            style={[Style.btnText, Style.btnConfirm, this.customStyles.btnConfirm]}
                                        >
                                            <Text
                                                style={[Style.btnTextConfirm, this.customStyles.btnTextConfirm]}>{this.confirmBtnText}</Text>
                                        </TouchableHighlight>
                                    </Animated.View>
                                </TouchableHighlight>
                            </TouchableHighlight>
                        </Modal>
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
;

export default DatePicker;
