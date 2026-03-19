import 'package:flutter_test/flutter_test.dart';

import 'package:quran_audio_app/main.dart';

void main() {
  testWidgets('App loads correctly', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const QuranAudioApp());

    // Verify that the app title is displayed
    expect(find.text('القرآن الكريم'), findsOneWidget);
  });
}
