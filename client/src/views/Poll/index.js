/*eslint-disable*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import { getPollById } from "../../actions/polls";
import { vote } from "../../actions/answers";

class Poll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poll: {},
      totalVoted: 0,
      voted: false
    };
  }

  componentDidMount() {
    this.props.getPollById(this.props.match.params.id).then(poll => {
      const totalVoted = this.getTotalVoted(poll);
      this.setState({ poll, totalVoted });
    });
  }

  getTotalVoted = poll => {
    const totalVoted = poll.answers.reduce((acc, next) => {
      return acc + next.voted.length;
    }, 0);
    return totalVoted;
  };

  sortCompareFunction = (a, b) => {
    return a.order - b.order;
  };

  vote = id => {
    if (!this.state.voted) {
      this.props.vote(id).then(newanswer => {
        if (newanswer) {
          this.setState(prevState => {
            let pollCopy = { ...prevState.poll };
            const answers = pollCopy.answers.map(answer => {
              if (answer._id.toString() === id) {
                return {
                  ...newanswer
                };
              }
              return answer;
            });

            pollCopy.answers = answers;
            const totalVoted = this.getTotalVoted(pollCopy);

            return {
              poll: pollCopy,
              totalVoted,
              voted: true
            };
          });
        }
      });
    }
  };

  isUserVoted = answer => {
    return answer.voted.find(user_id => user_id === this.props.user.id);
  };

  getPercentValue = voted => {
    if (voted || this.state.totalVoted) {
      return (voted / this.state.totalVoted) * 100;
    }
    return 0;
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="page-container">
        <Card
          style={{
            width: "70%"
          }}
        >
          <CardHeader color="primary">
            <Typography
              variant="headline"
              style={{
                color: "#fff"
              }}
            >
              This is poll results
            </Typography>
            <p className="form__subtitle">Please, choose your answer</p>
          </CardHeader>
          <CardBody
            style={{
              marginTop: "20px"
            }}
          >
            <Typography
              variant="title"
              style={{
                color: "gray"
              }}
            >
              {this.state.poll.question}
            </Typography>
            <Table className={classes.table}>
              <TableBody>
                {this.state.poll.answers ? (
                  this.state.poll.answers
                    .sort(this.sortCompareFunction)
                    .map(answer => {
                      return (
                        <TableRow
                          key={answer._id}
                          onClick={() => this.vote(answer._id)}
                          style={{
                            cursor: "pointer"
                          }}
                          hover={true}
                        >
                          <TableCell component="th" scope="row">
                            <div
                              className={classnames({
                                voted: this.isUserVoted(answer)
                              })}
                            >
                              {answer.answer}
                            </div>
                          </TableCell>
                          <TableCell numeric>{answer.voted.length}</TableCell>
                          <TableCell>
                            <div className="progress">
                              <div
                                className="progress__inner"
                                style={{
                                  width:
                                    this.getPercentValue(answer.voted.length) +
                                    "%"
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    );
  }
}
Poll.propTypes = {
  classes: PropTypes.object.isRequired,
  getPollById: PropTypes.func,
  vote: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { getPollById, vote }
)(withStyles(dashboardStyle)(Poll));
