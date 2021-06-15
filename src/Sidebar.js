import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  makeStyles,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider,
  TextField,
  Grid,
  Divider,
  Checkbox,
} from '@material-ui/core';
import { useQuery } from 'jsonapi-react';
import Filter from './Filter';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: theme.drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    padding: theme.spacing(3),
  },
  smallPadding: {
    padding: theme.spacing(1),
  },
  mediumPadding: {
    padding: '4px 16px 4px 16px',
  },
}));

function Sidebar(props) {
  const classes = useStyles();
  const {
    similarity,
    setSimilarity,
    workspaces,
    setWorkspaces,
    archived,
    setArchived,
    published,
    setPublished,
    mediaTypes,
    setMediaTypes,
    fuzzy,
    setFuzzy,
  } = props;

  function handleFuzzyChange(e) {
    const isFuzzy = e.target.checked;
    setFuzzy(isFuzzy);
  }

  function SimilarityContainer() {
    const [localSimilarity, setLocalSimilarity] = React.useState(similarity);

    function handleSimilarityTextFieldChange(e) {
      setLocalSimilarity(+e.target.value);
    }

    function handleSimilaritySliderChange(e, newValue) {
      setLocalSimilarity(newValue);
    }

    function handleBlur() {
      setSimilarity(localSimilarity);
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
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={8} className={classes.smallPadding}>
          <Slider
            defaultValue={80}
            step={20}
            marks
            min={0}
            max={100}
            value={localSimilarity}
            onChange={handleSimilaritySliderChange}
            onBlur={handleBlur}
          />
        </Grid>
      </Grid>
    );
  }

  const workspacesQuery = useQuery([
    'workspaces',
    { filter: { is_similarity_feature_enabled: 1 } },
  ]);

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
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
          <ListItem button className={classes.mediumPadding}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={fuzzy}
                name="fuzzy"
                onClick={handleFuzzyChange}
                color="primary"
              />
            </ListItemIcon>
            <ListItemText primary="Fuzzy" />
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
            isAllDefault
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
            value={mediaTypes}
            setValue={setMediaTypes}
            isAllDefault
          />
          <Filter
            header={
              <Typography variant="h6" noWrap>
                <FormattedMessage
                  id="filters.published"
                  defaultMessage="Published"
                  description="This is a heading that will be immediately followed by checkboxes that let you filter search items by whether they have been published or not."
                />
              </Typography>
            }
            value={published}
            setValue={setPublished}
            isAllDefault
          />
          <Filter
            header={
              <Typography variant="h6" noWrap>
                <FormattedMessage
                  id="filters.archived"
                  defaultMessage="Trash"
                  description="This is a heading that will be immediately followed by checkboxes that let you filter search items by whether they have been moved to the trash."
                />
              </Typography>
            }
            value={archived}
            setValue={setArchived}
            isOpenDefault={false}
            isAllDefault={false}
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
  setArchived: undefined,
  setPublished: undefined,
  fuzzy: false,
  setFuzzy: undefined,
};

Sidebar.propTypes = {
  similarity: PropTypes.number,
  setSimilarity: PropTypes.func,
  workspaces: PropTypes.array,
  setWorkspaces: PropTypes.func,
  setMediaTypes: PropTypes.func,
  setArchived: PropTypes.func,
  setPublished: PropTypes.func,
  fuzzy: PropTypes.bool,
  setFuzzy: PropTypes.func,
};

export default Sidebar;
