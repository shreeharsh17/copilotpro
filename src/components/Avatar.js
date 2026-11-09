import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const portraits = {
  SC: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces',
  MR: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces',
  AO: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
  TW: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=faces',
  PK: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=160&h=160&fit=crop&crop=faces',
  EB: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=160&h=160&fit=crop&crop=faces',
};

export default function Avatar({ initials = 'ST', size = 48, color = '#E9E5FF', photo = false }) {
  const [failedFor, setFailedFor] = useState(null);
  const image = photo && failedFor !== initials && portraits[initials];
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      {image ? (
        <Image source={{ uri: image }} onError={() => setFailedFor(initials)} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={{ color: '#5546E8', fontWeight: '700', fontSize: size * 0.32 }}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({ container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } });
