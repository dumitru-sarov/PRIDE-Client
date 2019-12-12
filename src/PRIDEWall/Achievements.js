import React, { Component } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'

export default class Achievements extends Component {
    constructor() {
        super()
        this.state = {
            records: []
        };
    }

    /**
     * componentDidMount code is exectued when the page first loads.
     * The method contains two fetch requests to obtain data from the back end servers.
     * The first receives data from the Express back end and defines 5 variables (p,r,i,d,e) to store data from the received
     * JSON object. These variables represent the number of each category of PRIDE card that the user has received.
     *
     * The second fetch request receives data from the SpringBoot server via an end point containing the logged in employee number
     * and their number of each category of PRIDE card. Data from the response is assigned to the value of the records key within the this.state object.
     */

    componentDidMount = () => {
        fetch('http://10.0.2.11:5000/cards/cardNumbers')
            .then(response => response.json())
            .then(data => {
                let p = data.P;
                let r = data.R;
                let i = data.I;
                let d = data.D;
                let e = data.E;

                fetch(`http://10.0.2.11:9001/emp_achievements/P430221/${p}/${r}/${i}/${d}/${e}`)
                    .then(response => response.json())
                    .then(data => {
                        this.setState({
                            records: data
                        })
                    })
            })
    }

    calculateExperience = () => {
        var total = 0
        var level
        var outof = 0
        this.state.records.forEach(each => {
            total += each.pointsachieved
        })
        if (total < 30) {
            level = "PRIDE Recruit"
            outof = 30
        }
        else if (total >= 30 && total < 100) {
            level = "PRIDE Learner"
            outof = 100
        }
        else {
            level = "PRIDE Master"
            outof = total
        }
        var toachieve = outof - total
        var experience = { "level": level, "pointsoutof": outof, "pointsachieved": total, "pointstoachieve": toachieve }
        return experience
    }

    render() {
        return (
            <div>
                <div style={{ textalign: 'center' }}>

                </div>
                <table style={{ textalign: 'center' }}>
                    <tbody>

                        <tr><td><h1>Milestones</h1></td></tr>
                        {this.state.records.map(each => {
                            return (
                                <tr key={each.achievementdesc}>
                                    <td style={{ margin: '5px' }}>{each.achievementdesc}
                                        <div className="div4">
                                            <ProgressBar >
                                                <ProgressBar striped variant="danger" label={each.progressachieved} animated now={each.progressachieved} key={1} max={each.progressbar} />
                                            </ProgressBar>
                                        </div>
                                    </td>

                                    <td style={{ margin: '5px' }}>{each.points}pp</td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}
