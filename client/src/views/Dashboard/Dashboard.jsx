import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";

import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import withStyles from "@material-ui/core/styles/withStyles";
import getVisiblePolls from "../../selectors/pollsSelector";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import { getPolls } from "../../actions/polls";
import { setFilter } from "../../actions/filters";

class Dashboard extends React.Component {
  state = {
    activeFilter: 0
  };

  setFilter = filterValue => {
    this.setState(
      {
        activeFilter: filterValue
      },
      () => {
        this.props.setFilter(!!filterValue);
      }
    );
  };

  componentDidMount() {
    this.props.getPolls();
  }

  addNewPoll = () => {
    this.props.push("/create");
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="page-container">
        <Button
          variant="raised"
          style={{
            backgroundColor: "#9c27b0",
            color: "white",
            alignSelf: "flex-start",
            fontWeight: "300",
            textTransform: "uppercase",
            marginBottom: "20px"
          }}
          className={classes.primary}
          onClick={this.addNewPoll}
        >
          add new poll
        </Button>

        <Card>
          <CardHeader color="info">
            <Typography
              variant="title"
              style={{
                color: "#fff",
                fontWeight: "300"
              }}
            >
              Polls
            </Typography>
            <div className="filters">
              <Button
                variant="raised"
                style={{
                  backgroundColor:
                    this.state.activeFilter === 0 ? "#9c27b0" : "#ccc",
                  color: "white",
                  fontWeight: "300",
                  padding: "12px 20px",
                  textTransform: "uppercase"
                }}
                className={classes.primary}
                onClick={() => this.setFilter(0)}
              >
                not voted polls
              </Button>

              <Button
                variant="raised"
                style={{
                  backgroundColor:
                    this.state.activeFilter === 1 ? "#9c27b0" : "#ccc",
                  color: "white",
                  alignSelf: "flex-start",
                  fontWeight: "300",
                  padding: "12px 20px",
                  textTransform: "uppercase"
                }}
                className={classes.primary}
                onClick={() => this.setFilter(1)}
              >
                voted polls
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <List>
              {this.props.polls.map(poll => (
                <ListItem
                  key={poll._id}
                  className="polls-item"
                  divider={true}
                  style={{
                    margin: "5px"
                  }}
                >
                  <Link to={`/poll/${poll._id}`} className="polls-item-link">
                    {poll.question}
                  </Link>
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  getPolls: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  polls: PropTypes.array
};

const mapStateToProps = (state, props) => ({
  polls: getVisiblePolls(state, props)
});

export default connect(
  mapStateToProps,
  { getPolls, setFilter, push }
)(withStyles(dashboardStyle)(Dashboard));
