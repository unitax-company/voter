import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import debounce from "debounce";

import TextField from "@material-ui/core/TextField";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Typography from "@material-ui/core/Typography";
import Button from "components/CustomButtons/Button.jsx";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Modal from "@material-ui/core/Modal";

import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Cancel from "@material-ui/icons/Cancel";

import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import EditPollModal from "./EditModal";
import { addPollQuestion, editPollQuestion } from "../../actions/polls";
import { addAnswer, editAnswer, deleteAnswer } from "../../actions/answers";

class CreateNewPoll extends Component {
  state = {
    question: "",
    id: "",
    isQuestionChanged: false,
    openDeleteModal: false,
    openEditModal: false,
    currentEditAnswerIndex: 0,
    answers: []
  };

  onChangeInput = e => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState(
      prevState => {
        if (prevState.question !== value) {
          return {
            [name]: value,
            isQuestionChanged: true
          };
        } else if (value === "") {
          // send to server for validation
          return {
            isQuestionChanged: true
          };
        }
      },
      () => {
        if (this.state.isQuestionChanged) {
          this.delayedCallback(this.onSaveQuestionInput);
        }
      }
    );
  };

  onSaveQuestionInput = () => {
    if (!this.state.id) {
      this.props
        .addPollQuestion({
          question: this.state.question
        })
        .then(poll => {
          if (poll) {
            this.setState({ id: poll._id, isQuestionChanged: false });
          }
        });
    } else {
      if (this.state.isQuestionChanged) {
        this.props
          .editPollQuestion({
            question: this.state.question,
            id: this.state.id
          })
          .then(res => {
            this.setState({
              isQuestionChanged: false
            });
          });
      }
    }
  };

  saveAnswerInput = answer => {
    const dataSend = {
      answer: answer.answer,
      order: answer.order
    };
    this.props.addAnswer(this.state.id, dataSend).then(savedAnswer => {
      this.setStateAnswer(savedAnswer);
    });
  };

  setStateAnswer = answer => {
    this.setState(
      prevState => {
        let answers = prevState.answers.map(item => ({ ...item }));
        answers[prevState.currentEditAnswerIndex] = answer;
        return {
          answers
        };
      },
      () => {
        this.handleModalClose("openEditModal");
      }
    );
  };

  editAnswerInput = answer => {
    const dataSend = {
      answer: answer.answer
    };
    this.props.editAnswer(answer._id, dataSend).then(savedAnswer => {
      this.setStateAnswer(savedAnswer);
    });
  };

  handleModalOpen = (modal, ind) => {
    this.setState({ [modal]: true, currentEditAnswerIndex: ind });
  };

  handleModalClose = open => {
    this.setState({ [open]: false });
  };

  deleteAnswer = () => {
    const deleteFromState = () => {
      this.setState(
        prevState => {
          let answers = prevState.answers.slice();
          answers.splice(prevState.currentEditAnswerIndex, 1);
          return {
            answers
          };
        },
        () => {
          if (this.state.currentEditAnswerIndex !== this.state.answers.length) {
            this.saveOrders(this.state.currentEditAnswerIndex);
          }
          this.handleModalClose("openDeleteModal");
        }
      );
    };
    if (this.state.answers[this.state.currentEditAnswerIndex]._id) {
      this.props
        .deleteAnswer(
          this.state.id,
          this.state.answers[this.state.currentEditAnswerIndex]._id
        )
        .then(() => {
          deleteFromState();
        });
    } else {
      deleteFromState();
    }
  };

  addAnswer = () => {
    this.setState(prevState => {
      let newAnser = {
        answer: "",
        order: prevState.answers.length
      };
      return {
        answers: [...prevState.answers, newAnser]
      };
    });
  };

  movePollUp = ind => {
    this.setState(prevState => {
      const indexMove = this.getIndex(ind - 1);
      let answers = prevState.answers.slice();
      let answerToMove = answers.splice(ind, 1);
      answers.splice(indexMove, 0, answerToMove[0]);
      return {
        answers
      };
    }, this.saveOrders);
  };

  saveOrders = (from = 0) => {
    const answers = this.state.answers.map(el => ({ ...el }));
    for (let i = from; i < answers.length; i++) {
      let item = answers[i];
      if (item._id) {
        this.props.editAnswer(item._id, { order: i });
      }
      item.order = i;
    }
    this.setState({ answers });
  };

  movePollDown = ind => {
    this.setState(prevState => {
      let answers = prevState.answers.slice();
      let answerToMove = answers.splice(ind, 1);
      let indexMove = this.getIndex(ind + 1);
      answers.splice(indexMove, 0, answerToMove[0]);
      return {
        answers
      };
    }, this.saveOrders);
  };

  keyPressedQuestion = e => {
    if (e.keyCode === 13) {
      this.onSaveQuestionInput();
    }
  };

  getIndex = n => {
    return (n + this.state.answers.length) % this.state.answers.length;
  };

  delayedCallback = debounce(function(fn, ...rest) {
    fn.apply(this, rest);
  }, 2000);

  render() {
    const { classes } = this.props;
    const styleModal = {
      top: "50%",
      left: "50%",
      position: "absolute",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      border: "1px solid #ccc",
      padding: "20px"
    };

    return (
      <div>
        <Card
          style={{
            width: "70%"
          }}
        >
          <CardHeader color="primary">
            <Typography
              variant="title"
              style={{
                color: "#fff",
                fontWeight: "300"
              }}
            >
              Create new poll
            </Typography>
            <p className="form__subtitle">
              Please, add your question and answers for polling
            </p>
          </CardHeader>
          <CardBody>
            <TextField
              id="question-input"
              label="Question"
              className={classes.textField}
              type="text"
              margin="normal"
              name="question"
              value={this.state.question}
              onChange={this.onChangeInput}
              onKeyDown={this.keyPressedQuestion}
              error={!!this.props.errors.question}
              style={{
                width: "100%"
              }}
            />
            {this.props.errors.question && (
              <div className="error-label">{this.props.errors.question}</div>
            )}
            <div className="answers">
              <List>
                {this.state.answers.map((answer, ind) => (
                  <ListItem
                    key={ind}
                    divider={true}
                    style={{
                      justifyContent: "space-between"
                    }}
                  >
                    <div
                      className="answers__text"
                      style={{
                        cursor: "pointer"
                      }}
                      onClick={() => this.handleModalOpen("openEditModal", ind)}
                    >
                      {answer.answer !== "" ? (
                        answer.answer
                      ) : (
                        <span style={{ color: "gray" }}>
                          Please click to edit this field
                        </span>
                      )}
                    </div>
                    <div className="answers__controls">
                      <Button
                        justIcon
                        color="info"
                        style={{
                          padding: "12px 30px"
                        }}
                        onClick={() => this.movePollUp(ind)}
                      >
                        <ArrowUpward />
                      </Button>
                      <Button
                        justIcon
                        color="info"
                        style={{
                          padding: "12px 30px"
                        }}
                        onClick={() => this.movePollDown(ind)}
                      >
                        <ArrowDownward />
                      </Button>
                      <Button
                        justIcon
                        color="warning"
                        style={{
                          padding: "12px 30px"
                        }}
                        onClick={() =>
                          this.handleModalOpen("openDeleteModal", ind)
                        }
                      >
                        <Cancel />
                      </Button>
                    </div>
                  </ListItem>
                ))}
              </List>
            </div>
            <Button
              color="primary"
              onClick={this.addAnswer}
              disabled={!!!this.state.id}
            >
              Add answer
            </Button>
          </CardBody>
        </Card>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.openDeleteModal}
          onClose={() => this.handleModalClose("openDeleteModal")}
        >
          <div style={styleModal} className={classes.paper}>
            <Typography
              variant="title"
              id="modal-title"
              style={{
                margin: "20px 0"
              }}
            >
              Are you sure you want to delete this poll?
            </Typography>
            <div
              className="buttons"
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Button
                color="warning"
                onClick={() => this.handleModalClose("openDeleteModal")}
              >
                Cancel
              </Button>
              <Button color="danger" onClick={this.deleteAnswer}>
                DELETE
              </Button>
            </div>
          </div>
        </Modal>
        <EditPollModal
          answer={this.state.answers[this.state.currentEditAnswerIndex]}
          key={this.state.openEditModal}
          open={this.state.openEditModal}
          handleClose={() => this.handleModalClose("openEditModal")}
          handleSave={this.saveAnswerInput}
          handleEdit={this.editAnswerInput}
        />
      </div>
    );
  }
}

CreateNewPoll.propTypes = {
  classes: PropTypes.object.isRequired,
  addPollQuestion: PropTypes.func.isRequired,
  editPollQuestion: PropTypes.func.isRequired,
  errors: PropTypes.object,
  addAnswer: PropTypes.func.isRequired,
  editAnswer: PropTypes.func.isRequired,
  deleteAnswer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addPollQuestion, editPollQuestion, addAnswer, editAnswer, deleteAnswer }
)(withStyles(dashboardStyle)(CreateNewPoll));
