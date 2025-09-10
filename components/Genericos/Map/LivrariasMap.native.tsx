import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

export type Store = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
};

type LivrariasMapProps = {
  stores: Store[];
  initialRegion?: Region;
  height?: number;
};

export default function LivrariasMap({ stores, initialRegion, height = 300 }: LivrariasMapProps) {
  const defaultRegion: Region =
    initialRegion || {
      latitude: stores[0]?.latitude || -31.7654, // Pelotas - RS
      longitude: stores[0]?.longitude || -52.3371,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };

  return (
    <View style={[styles.container, { height }]}> 
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={defaultRegion}
      >
        {stores.map((s) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.latitude, longitude: s.longitude }}
            title={s.name}
            description={s.address}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
