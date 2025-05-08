// screens/advise/InsightPage.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';
import { LineChart } from 'react-native-chart-kit';

const markdownStyles = {
    body:         { color: '#333', fontSize: 16, lineHeight: 22 },
    strong:       { fontWeight: '700' },
    bullet_list:  { marginBottom: 4 },
    heading2:     { fontSize: 18, fontWeight: '600', marginVertical: 6 },
  } as any;

const InsightPage = () => {
  /* ───── state & helpers ───── */
  const [loading, setLoading]   = useState(true);
  const [insight, setInsight]   = useState<string>('');
  const [history, setHistory]   = useState<{ date: string; limit: number }[]>([]);

  /* ───── fetch on mount ───── */
  useEffect(() => {
    (async () => {
      setLoading(true);

      /* Pull user data from AsyncStorage */
      const userData = {
        Income:     Number(await AsyncStorage.getItem('Income'))     || 0,
        Rating:     Number(await AsyncStorage.getItem('Rating'))     || 0,
        Cards:      Number(await AsyncStorage.getItem('Cards'))      || 0,
        Age:        Number(await AsyncStorage.getItem('Age'))        || 0,
        Education:  Number(await AsyncStorage.getItem('Education'))  || 0,
        Balance:    Number(await AsyncStorage.getItem('Balance'))    || 0,
        Ethnicity:       await AsyncStorage.getItem('Ethnicity')     || 'Not Specified',
        Student:    (await AsyncStorage.getItem('Student'))  === 'true',
        Married:    (await AsyncStorage.getItem('Married'))  === 'true',
      };

      /* Talk to backend ➜ Gemini */
      try {
        const res  = await fetch('http://127.0.0.1:8000/api/insight/', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify({ userData }),
        });
        const json = await res.json();
        setInsight(json.reply ?? 'No insight received.');
      } catch (err) {
        console.warn('Insight fetch failed:', err);
        setInsight('Failed to fetch insight.');
      }

      /* Optional – credit-limit history */
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const hRes  = await fetch(`http://127.0.0.1:8000/api/history/${userId}`);
          const hJson = await hRes.json();
          setHistory(hJson.history ?? []);
        }
      } catch (err) {
        console.warn('History fetch failed:', err);
      }

      

      setLoading(false);
    })();
  }, []);

  /* ───── render ───── */
  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.h1}>AI Financial Analysis</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Gemini Analysis */}
          <Text variant="titleLarge" style={styles.h2}>Gemini Analysis:</Text>

          <Markdown style={markdownStyles}>
            {insight}
            </Markdown>

          {/* Credit history line-chart (optional)
          {history.length > 0 && (
            <>
              <Text variant="titleLarge" style={styles.h2}>Credit Limit History</Text>
              <LineChart
                data={{
                  labels   : history.map(h => h.date.split('T')[0]),
                  datasets : [{ data: history.map(h => h.limit) }],
                }}
                width={Dimensions.get('window').width - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo:   '#fff',
                  decimalPlaces: 0,
                  color: (o=1) => `rgba(0,122,255,${o})`,
                  style: { borderRadius: 16 },
                }}
                bezier
                style={{ borderRadius: 16, marginTop: 16 }}
              />
            </>
          )} */}
        </>
      )}
    </ScrollView>
  );
};

/* ───── styles ───── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  h1:       { marginBottom: 12, color: '#333' },
  h2:       { marginTop: 24, marginBottom: 8, color: '#007AFF' },
});

// /* Optional – tweak markdown colours / spacing */
// const markdownStyles = {
//   body:   { color: '#333', fontSize: 16, lineHeight: 24 },
//   strong: { fontWeight: 'bold' },
//   bullet_list: { marginBottom: 8 },
// };

export default InsightPage;
