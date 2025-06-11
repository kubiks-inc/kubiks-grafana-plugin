import React, { useState, useEffect, useRef } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Card, Button, Icon } from '@grafana/ui';

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  status: 'running' | 'stopped' | 'pending';
}

interface ServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceCard[];
}

export const ServiceDrawer: React.FC<ServiceDrawerProps> = ({ isOpen, onClose, services }) => {
  const styles = useStyles2(getStyles);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
        setIsScrolledToBottom(isAtBottom);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      // Check initial scroll position
      handleScroll();
      
      return () => {
        contentElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen, services]);

  if (!isOpen) {
    return null;
  }

  const getStatusColor = (status: ServiceCard['status']) => {
    switch (status) {
      case 'running':
        return 'green';
      case 'stopped':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h3 className={styles.title}>Services</h3>
          <Button
            variant="secondary"
            size="sm"
            icon="times"
            onClick={onClose}
            className={styles.closeButton}
          />
        </div>
        
        <div 
          ref={contentRef}
          className={styles.content}
        >
          <div className={styles.cardContainer}>
            {services.map((service) => (
              <Card key={service.id} className={styles.serviceCard}>
                <Card.Heading className={styles.cardHeader}>
                  {service.title}
                  <span 
                    className={styles.statusIndicator}
                    style={{ backgroundColor: getStatusColor(service.status) }}
                  />
                </Card.Heading>
                <Card.Description>{service.description}</Card.Description>
                <Card.Actions>
                  <Button size="sm" variant="secondary">
                    {service.status === 'running' ? 'Stop' : 'Start'}
                  </Button>
                  <Button size="sm" variant="secondary">
                    Details
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </div>
        </div>
        
        {!isScrolledToBottom && services.length > 0 && (
          <div className={styles.scrollIndicator}>
            <Icon name="angle-down" />
            <span>Scroll to see more services</span>
          </div>
        )}
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  overlay: css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
  `,
  
  drawer: css`
    width: 400px;
    height: 100vh;
    background-color: ${theme.colors.background.primary};
    border-left: 1px solid ${theme.colors.border.medium};
    display: flex;
    flex-direction: column;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  `,
  
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing(2)};
    border-bottom: 1px solid ${theme.colors.border.medium};
    background-color: ${theme.colors.background.secondary};
  `,
  
  title: css`
    margin: 0;
    font-size: ${theme.typography.h4.fontSize};
    color: ${theme.colors.text.primary};
  `,
  
  closeButton: css`
    background: none;
    border: none;
    cursor: pointer;
  `,
  
  content: css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    /* Ensure proper scrolling with padding */
    padding: 0;
    /* Add scroll behavior for smooth scrolling */
    scroll-behavior: smooth;
  `,
  
  cardContainer: css`
    padding: ${theme.spacing(2)};
    /* Add bottom padding to ensure last card is fully visible */
    padding-bottom: ${theme.spacing(4)};
  `,
  
  serviceCard: css`
    margin-bottom: ${theme.spacing(2)};
    /* Ensure the card doesn't get cut off */
    min-height: auto;
    
    &:last-child {
      /* Extra margin for the last card to ensure it's fully visible */
      margin-bottom: ${theme.spacing(2)};
    }
  `,
  
  cardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  
  statusIndicator: css`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-left: ${theme.spacing(1)};
  `,
  
  scrollIndicator: css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing(1)};
    background-color: ${theme.colors.background.secondary};
    border-top: 1px solid ${theme.colors.border.medium};
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.bodySmall.fontSize};
    
    > span {
      margin-left: ${theme.spacing(0.5)};
    }
  `,
});