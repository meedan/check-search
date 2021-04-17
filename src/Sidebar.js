import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  makeStyles,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  Slider,
  TextField,
  Grid,
  Divider,
} from '@material-ui/core';
import { useQuery } from 'jsonapi-react';
import Filter from './Filter';

const drawerWidth = 297;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    padding: theme.spacing(3),
  },
  slider: {
    padding: theme.spacing(2),
  },
}));

function Sidebar(props) {
  const classes = useStyles();
  const { similarity, setSimilarity, workspaces, setWorkspaces } = props;
  function handleSimilarityTextFieldChange(e) {
    setSimilarity(e.target.value);
  }

  function handleSimilaritySliderChange(e, newValue) {
    setSimilarity(newValue);
  }

  const workspacesQuery = useQuery('workspaces');
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          <ListItem>
            <Typography variant="h5" noWrap>
              <FormattedMessage
                id="sidebar.filters"
                defaultMessage="Filters"
                description="A header field for a list of different filters. A plural noun, not an imperative verb."
              />
            </Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6" noWrap>
                  <FormattedMessage
                    id="sidebar.similarity"
                    defaultMessage="Similarity"
                    description="This is a section header, letting the user know that the options inside relate to making their search results more or less similar to their query."
                  />
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="similarity-text"
                  type="number"
                  variant="outlined"
                  margin="dense"
                  value={similarity}
                  onChange={handleSimilarityTextFieldChange}
                />
              </Grid>
              <Grid item xs={8} className={classes.slider}>
                <Slider
                  defaultValue={80}
                  step={20}
                  marks
                  min={0}
                  max={100}
                  value={similarity}
                  onChange={handleSimilaritySliderChange}
                />
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <Filter
            header={
              <Typography variant="h6" noWrap>
                <FormattedMessage
                  id="filters.organizations"
                  defaultMessage="Publishers"
                />
              </Typography>
            }
            items={[['All'], ['Check workspaces', 'Non-Check workspaces']]}
            query={workspacesQuery}
            setValue={setWorkspaces}
            value={workspaces}
          />
          <Filter
            header={
              <Typography variant="h6" noWrap>
                <FormattedMessage
                  id="filters.type"
                  defaultMessage="Content Type"
                />
              </Typography>
            }
            items={[['All'], ['Report published', 'Query submissions']]}
          />
        </List>
      </div>
    </Drawer>
  );
}

Sidebar.defaultProps = {
  similarity: 90,
  setSimilarity: undefined,
};

Sidebar.propTypes = {
  similarity: PropTypes.number,
  setSimilarity: PropTypes.func,
};

export default Sidebar;
