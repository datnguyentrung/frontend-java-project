import { Text } from 'react-native';

export default function HeaderTitle({ children }: { children: string }) {
    return (
        <Text
            style={{
                fontSize: 25,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#ffffff',
                letterSpacing: 0.5,
                textShadowColor: 'rgba(0, 0, 0, 0.6)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
                lineHeight: 22,
                textAlignVertical: 'center',
                paddingVertical: 6,
            }}
        >
            {children}
        </Text>
    );
}
