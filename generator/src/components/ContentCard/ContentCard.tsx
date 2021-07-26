import { Checkbox, DefaultEffects, Icon, IStyle, mergeStyles } from '@fluentui/react';
import * as React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getTheme } from '@fluentui/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedWorkloadState } from '../../state/selectedWorkloadState';
import { selectedResourcesState } from '../../state/resourcesState';
import { Workload } from '../../models/Workload';

export interface IContentCardProps {
  workload: Workload;
}
export const ContentCard: React.FunctionComponent<IContentCardProps> = (props) => {
  const history = useHistory();
  const [isHovered, setIsHovered] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isInderminate, setIsInderminate] = useState(false);
  const theme = getTheme();
  const setSelectedWorkload = useSetRecoilState(selectedWorkloadState);
  const [selectedResources, setSelectedResources] = useRecoilState(selectedResourcesState);

  const _getWorkloadResources = React.useCallback(() => {
    return selectedResources.filter((r) => r.workload === props.workload.id);
  }, [selectedResources, props]);

  React.useEffect(() => {
    let workloadResources = _getWorkloadResources();

    if(workloadResources.map((r) => r.checked).every((checked) => { return checked === true; })) {
      setIsChecked(true);
    } else if(workloadResources.map((r) => r.checked).every((checked) => { return checked === false; })) {
      setIsChecked(false)
    } else {
      setIsChecked(false);
      setIsInderminate(true);
    }
  }, [_getWorkloadResources]);

  const _onSelectAll = (workload: Workload, checked?: boolean) => {
    if(isInderminate || checked) {
      setSelectedResources((selectedResources) => {
        return selectedResources.map((resource) => {
          const updatedResource = resource.workload === workload.id ? { ...resource, checked: true } : resource;
          return updatedResource;
        });
      });
    } else {
      setSelectedResources((selectedResources) => {
        return selectedResources.map((resource) => {
          const updatedResource = resource.workload === workload.id ? { ...resource, checked: false } : resource;
          return updatedResource;
        });
      });
    }
  };

  const _getCheckedWorkloadResources = () => {
    return _getWorkloadResources().filter((r) => r.checked === true);
  }

  const contentCardStyles: IStyle = {
    backgroundColor: theme.palette.white,
    padding: '40px',
    boxShadow: DefaultEffects.elevation4,
  };

  const titleStyles: IStyle = {
    marginTop: '-70px',
    paddingBottom: '16px',
    paddingTop: '60px',
    display: 'flex',
    alignItems: 'center'
  };

  const iconStyles = mergeStyles({
    fontSize: 25,
    height: 25,
    width: 25,
    margin: '0 8px 0 0',
  });

  const linkIconStyles = mergeStyles({
    fontSize: 16,
    height: 16,
    width: 16,
    color: theme.palette.themePrimary,
    margin: '0 0 0 8px',
    cursor: 'pointer'
  });

  return (
    <div className={`${mergeStyles(contentCardStyles)} section-title`}>
      <div>
        {props.workload && (
          <h2
            className={mergeStyles(titleStyles)}
            id={props.workload.title}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
              {props.workload.iconName && <Icon iconName={props.workload.iconName} className={iconStyles} />}
              {props.workload.title}
              {isHovered && (
                <Icon
                iconName={"Link"}
                className={linkIconStyles}
                onClick={(ev?: React.MouseEvent<HTMLElement>) => {
                  let hash = "#" + props.workload.title;
                  window.location.hash = hash;
                  history.push(hash);
                  setSelectedWorkload(props.workload.title);
                }} />
              )}
              <Checkbox
                id={`chkSelectAll-${props.workload.id}`}
                label={isInderminate ? `${_getCheckedWorkloadResources().length} selected` : isChecked ? "Unselect all" : "Select all" }
                styles={{ root: {right: 0, marginRight: '80px', position: 'absolute'}}}
                checked={isChecked}
                indeterminate={isInderminate}
                onChange={(ev, checked) => _onSelectAll(props.workload, checked)}
              />
          </h2>
        )}

        {props.children}
      </div>
    </div>
  );
};
