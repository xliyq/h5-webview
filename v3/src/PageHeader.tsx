import classnames from 'classnames';
import React, { Component, ReactNode } from 'react';
import IComponentProps from './base/interfaces/IComponentProps';
import './PageHeader.less';

interface IPageHeaderState {}
export interface IPageHeaderProps extends IComponentProps {
  /**
   * 附加内容，显示在页头右侧
   */
  extra?: ReactNode;

  /**
   * 标题
   */
  title: string;

  /**
   * 点击返回触发的方法。默认为null，此时，不显示返回按钮
   */
  onBack?: () => void;

  /**
   * 返回按钮的图标
   */
  backIcon?: ReactNode;
}

class PageHeader extends Component<IPageHeaderProps, IPageHeaderState> {
  private renderBack() {
    const { backIcon, onBack } = this.props;
    const showBack = Boolean(onBack);
    if (!showBack) {
      return <div></div>;
    }

    return (
      <div
        className="PageHeaderBack"
        onClick={() => {
          if (onBack) {
            onBack();
          }
        }}
      >
        {backIcon || <i className="BackIcon" />}
      </div>
    );
  }

  public render(): ReactNode {
    const { extra, title, className, style } = this.props;
    return (
      <div className={classnames('PageHeader', className)} style={style}>
        {this.renderBack()}
        <div className="PageHeaderTitle">{title}</div>
        <div className="PageHeaderExtra">{extra}</div>
      </div>
    );
  }
}

export default PageHeader;