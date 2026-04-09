'use client';

import { CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import { Button, Card, ConfigProvider, Flex, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import type { MapRef } from 'react-map-gl/maplibre';

import Filters from '@/features/map/components/Filters/Filters';
import SuppliersList from '@/features/map/components/SuppliersList/SuppliersList';
import ViewToggler from '@/features/map/components/ViewToggler/ViewToggler';
import { ViewMode } from '@/features/map/types';
import useMapData from '@/features/map/useMapData';

import LocationMap from '@/shared/ui/components/Map/LocationMap/LocationMap';

import styles from './SuppliersMap.module.scss';

/**
 * ConfigProvider theme is stable (never changes) so it never triggers
 * a subtree re-render that could remount the MapLibre canvas.
 * Dropdown/Select/Popover zIndex is always above the expanded card (z-index 2000).
 */
const ANT_THEME = {
  components: {
    Select: { zIndexPopup: 2100 },
    Popover: { zIndexPopup: 2100 },
    Dropdown: { zIndexPopup: 2100 },
    Tooltip: { zIndexPopup: 2100 },
  },
};

const SuppliersMap = () => {
  const [mapRef, setMapRef] = useState<MapRef | null>(null);
  const { mapPoints, filters, setFilters } = useMapData();
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Map);
  const [mapExpanded, setMapExpanded] = useState(false);

  /** Saved zoom/center captured synchronously before expand/collapse. */
  const savedViewRef = useRef<{ lng: number; lat: number; zoom: number } | null>(null);

  const handleMapReady = useCallback((ref: MapRef | null) => {
    setMapRef(ref);
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  /** Save current position BEFORE state change, then toggle. */
  const toggleExpand = useCallback(() => {
    if (mapRef) {
      const center = mapRef.getCenter();
      savedViewRef.current = { lng: center.lng, lat: center.lat, zoom: mapRef.getZoom() };
    }
    setMapExpanded((v) => !v);
  }, [mapRef]);

  useEffect(() => {
    if (mapExpanded) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mapExpanded]);

  useEffect(() => {
    if (!mapRef) return;

    const t = window.setTimeout(() => {
      requestAnimationFrame(() => {
        mapRef.resize();
        // Restore position after layout change; works even if the canvas remounted.
        if (savedViewRef.current) {
          const { lng, lat, zoom } = savedViewRef.current;
          mapRef.jumpTo({ center: [lng, lat], zoom });
          savedViewRef.current = null;
        }
      });
    }, 80);

    const handleWindowResize = () => {
      requestAnimationFrame(() => mapRef.resize());
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [mapRef, mapExpanded, viewMode]);

  useEffect(() => {
    if (!mapExpanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mapRef) {
          const center = mapRef.getCenter();
          savedViewRef.current = { lng: center.lng, lat: center.lat, zoom: mapRef.getZoom() };
        }
        setMapExpanded(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mapExpanded, mapRef]);

  // Map is always mounted to preserve zoom/center when toggling view or expanding.
  const renderedMap = useMemo(
    () => <LocationMap onMapReady={handleMapReady} data={mapPoints} />,
    [handleMapReady, mapPoints],
  );
  const renderedList = useMemo(() => <SuppliersList data={mapPoints} />, [mapPoints]);

  return (
    <ConfigProvider theme={ANT_THEME}>
      {/* Backdrop rendered via portal so it sits outside the card's stacking context */}
      {mapExpanded &&
        typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <button
            type="button"
            className={styles.mapExpandedBackdrop}
            aria-label="Згорнути карту"
            onClick={toggleExpand}
          />,
          document.body,
        )}

      <Flex vertical gap={8} className={styles.wrapper}>
        <Flex justify="space-between" align="flex-end">
          <Filters filters={filters} setFilters={setFilters} mapRef={mapRef} />
        </Flex>

        <Card
          className={classNames(styles.mapCard, {
            [styles.mapCardExpanded]: mapExpanded,
          })}
        >
          {/* Map is always in DOM — never unmounted — position preserved across toggles */}
          <div
            className={classNames(styles.mapArea, {
              [styles.mapAreaHidden]: viewMode !== ViewMode.Map,
            })}
          >
            {renderedMap}
            <div className={styles.mapControls}>
              <Tooltip title={mapExpanded ? 'Згорнути карту (Esc)' : 'Розгорнути карту на екран'}>
                <Button
                  type="default"
                  className={styles.expandMapBtn}
                  icon={mapExpanded ? <CompressOutlined /> : <ExpandOutlined />}
                  onClick={toggleExpand}
                  aria-expanded={mapExpanded}
                />
              </Tooltip>
              <ViewToggler viewMode={viewMode} onChange={handleViewModeChange} />
            </div>
          </div>

          {viewMode === ViewMode.List && (
            <div className={styles.listContent}>
              {renderedList}
              <div className={styles.listControls}>
                <ViewToggler viewMode={viewMode} onChange={handleViewModeChange} />
              </div>
            </div>
          )}
        </Card>
      </Flex>
    </ConfigProvider>
  );
};

export default SuppliersMap;
