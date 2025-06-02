import { ReactNode } from 'react';

/**
 * @property {number} ratio Default - 1
 * @property {number} height - In px. Default 32
 * @property {number} width - In px. Default 32
 * @property {key} key for ".map()" func
 */

interface ImageContainerProps extends React.Attributes{
    children: ReactNode;
    ratio?: number;
    height?: number;
    width?: number;
}

export const ImageContainer = (props: ImageContainerProps) => {
  const {
      children,
      ratio = 1,
      height = 32,
      width = 32,
  } = props;

    return (
        <div
            style={{
                display: 'flex',
                height: height + 'px',
                width: width + 'px',
                aspectRatio: ratio,
                backgroundColor: 'red'
            }}
        >
            {children}
        </div>
    )
}
