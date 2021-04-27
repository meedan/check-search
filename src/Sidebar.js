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
  Checkbox,
  FormControlLabel,
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
    padding: theme.spacing(1),
  },
}));

const mediaTypeOptions = [
  {
    label: 'Link',
    value: 'Link',
    isChecked: false,
  },
  {
    label: 'Text',
    value: 'Claim',
    isChecked: false,
  },
  {
    label: 'Image',
    value: 'UploadedImage',
    isChecked: false,
  },
];

function Sidebar(props) {
  const classes = useStyles();
  const {
    similarity,
    setSimilarity,
    workspaces,
    setWorkspaces,
    setMediaTypes,
    fuzzy,
    setFuzzy,
  } = props;

  function SimilarityContainer() {
    const [localSimilarity, setLocalSimilarity] = React.useState(similarity);

    function handleSimilarityTextFieldChange(e) {
      setLocalSimilarity(+e.target.value);
    }

    function handleSimilaritySliderChange(e, newValue) {
      setLocalSimilarity(newValue);
    }

    function handleFuzzyChange(e) {
      const isFuzzy = e.target.checked;
      setFuzzy(isFuzzy);
    }

    return (
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
            value={localSimilarity}
            onChange={handleSimilarityTextFieldChange}
            onBlur={() => setSimilarity(localSimilarity)}
          />
        </Grid>
        <Grid item xs={8} className={classes.slider}>
          <Slider
            defaultValue={80}
            step={20}
            marks
            min={0}
            max={100}
            value={localSimilarity}
            onChange={handleSimilaritySliderChange}
            onBlur={() => setSimilarity(localSimilarity)}
          />
        </Grid>
        <Grid item xs={12} className={classes.slider}>
          <FormControlLabel
            control={
              <Checkbox
                edge="start"
                checked={fuzzy}
                name="all"
                tabIndex={-1}
                onChange={handleFuzzyChange}
                disableRipple
              />
            }
            label="Fuzzy"
          />
        </Grid>
      </Grid>
    );
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
            <SimilarityContainer />
          </ListItem>
          <Divider />
          <Filter
            header={
              <Typography variant="h6" noWrap>
                <FormattedMessage
                  id="filters.organizations"
                  defaultMessage="Publishers"
                  description="This is a heading that will be immediately followed by a list of known publishing organizations that the user can choose from."
                />
              </Typography>
            }
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
                  description="This is a heading that will be immediately followed by a list of types of content (image, text, video) that the user can choose from."
                />
              </Typography>
            }
            value={mediaTypeOptions}
            setValue={setMediaTypes}
          />
        </List>
      </div>
    </Drawer>
  );
}

Sidebar.defaultProps = {
  similarity: 90,
  setSimilarity: undefined,
  workspaces: [],
  setWorkspaces: undefined,
  setMediaTypes: undefined,
  fuzzy: false,
  setFuzzy: undefined,
};

Sidebar.propTypes = {
  similarity: PropTypes.number,
  setSimilarity: PropTypes.func,
  workspaces: PropTypes.array,
  setWorkspaces: PropTypes.func,
  setMediaTypes: PropTypes.func,
  fuzzy: PropTypes.bool,
  setFuzzy: PropTypes.func,
};

export default Sidebar;
