import React from 'react'

class MonthSlider extends React.Component {
    constructor(props) {
        super(props);

        this.nextMonth = this.nextMonth.bind(this);
        this.prevMonth = this.prevMonth.bind(this);
    }

    nextMonth() {
        const {month} = this.props
        this.props.setMonth(month+1);
    }

    prevMonth() {
        const {month} = this.props
        this.props.setMonth(month-1);
    }

    render() {
        const labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const {month} = this.props

        return (
            <div className="month-slider">
                <button onClick={this.prevMonth}>{String.fromCharCode(8592)}</button>
                <h2>{labels[month]}</h2>
                <button onClick={this.nextMonth}>{String.fromCharCode(8594)}</button>
            </div>
        )
    }
}

export default MonthSlider