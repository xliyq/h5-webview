import IComponentProps from '@/base/interfaces/IComponentProps';
import PageView from '@/PageView';
import React, { Component, CSSProperties, ReactNode } from 'react';
import './Page.less';
import Toucher from './Toucher';

const classnames = require('classnames');

export interface IPageProps extends IComponentProps {
  close?: () => void;
}

/**
 * 弹出式页面
 */
class Page<P extends IPageProps, S> extends Component<P, S> {
  private _show: boolean = true;
  private _touchX: number = 0;
  private _closeTouchX: number = 80;
  private _touching: boolean = false;

  /**
   * 页头样式名
   */
  protected get headerClassName(): string {
    return '';
  }

  /**
   * 页头内联样式
   */
  protected get headerStyle(): CSSProperties {
    return {};
  }

  /**
   * 样式名
   */
  protected get className(): string {
    return '';
  }

  /**
   * 内联样式
   */
  protected get style(): CSSProperties {
    return {};
  }

  /**
   * 标题
   */
  protected get title(): string {
    return '';
  }

  /**
   * 是否隐藏头部
   */
  protected get hideHeader(): boolean {
    return false;
  }

  /**
   * 是否禁用返回按钮
   */
  protected get disabledBack(): boolean {
    return false;
  }

  /**
   * 是否禁用触摸返回
   */
  protected get disableTouchBack(): boolean {
    return false;
  }

  /**
   * 额外的内容，显示在头部右侧
   */
  protected get extra(): ReactNode {
    return null;
  }

  /**
   * 渲染头部，默认的头部包含3部分：返回按钮、标题、右侧扩展区
   *
   * 通常可使用参数按钮这部分的内容，如果默认结构无法满足需求，可重写此方法以完全自定义头部
   *
   * 重写时唯一要注意的地方是：关闭页面的需调用 this.close();
   */
  protected renderPageView(): ReactNode {
    const {
      title,
      extra,
      disabledBack,
      headerClassName,
      headerStyle,
      className,
      style,
      hideHeader,
    } = this;
    return (
      <PageView
        title={title}
        extra={extra}
        hideHeader={hideHeader}
        headerStyle={headerStyle}
        className={className}
        style={style}
        headerClassName={headerClassName}
        onBack={disabledBack ? undefined : () => this.close()}
      >
        {this.renderChildren()}
      </PageView>
    );
  }

  protected renderChildren(): ReactNode {
    return null;
  }

  /**
   * 关闭页面
   */
  protected close() {
    if (this._show) {
      this._show = false;
      this.forceUpdate();
    }
  }

  public render() {
    const _closeTouchX = this._closeTouchX;
    const disableTouchBack = this.disableTouchBack;
    const { close, className } = this.props;

    const style: any = {
      transform: `translateX(${this._touchX}px)`,
    };

    const bgStyle: any = {
      opacity: Math.min(
        1,
        0.2 + Math.max(0, (_closeTouchX - this._touchX) / _closeTouchX),
      ),
    };

    if (this._touching) {
      style.transition = 'none';
      bgStyle.transition = 'none';
    }
    return (
      <React.Fragment>
        <div
          className={classnames(
            'PageBg',
            this._show ? '' : 'PageBgClose',
            className,
          )}
          style={bgStyle}
        />
        <Toucher
          onTouching={x => {
            if (!disableTouchBack) {
              this._touching = true;
              this._touchX = Math.max(0, x);
              this.forceUpdate();
            }
          }}
          validateStartTouch={x => {
            return x < 80;
          }}
          onTouch={(h, v, x, y) => {
            if (!disableTouchBack) {
              this._touching = false;
              if (x > _closeTouchX) {
                this.close();
              } else {
                this._touchX = 0;
              }
              this.forceUpdate();
            }
          }}
          className={classnames(
            'Page',
            this.className,
            this._show ? '' : 'PageClose',
          )}
          onAnimationEnd={() => {
            if (!this._show && close) {
              close();
            }
          }}
          style={style}
        >
          {this.renderPageView()}
        </Toucher>
      </React.Fragment>
    );
  }
}

export default Page;
