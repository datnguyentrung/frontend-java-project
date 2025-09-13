

// Mapping từ feature title đến screen name
export const featureScreenMap: Record<string, string> = {
    "GOAT points": "GoatPointsScreen",
    "Điểm điểm danh": "GOATPointsAttendanceScreen",
    "Thời gian rèn luyện": "TrainingTimeScreen",
    "Kỹ năng": "SkillsScreen",
    "Thống kê": "StatisticsScreen",
    "Tính năng khác": "OtherFeaturesScreen",
    "Rèn luyện": "TrainingScreen",
    "Lịch học": "ScheduleScreen",
    "Điểm danh HLV": "CoachAttendanceScreen",
    "Nghỉ phép": "LeaveRequestScreen",
    "Điểm danh HV": "StudentAttendanceScreen",
    "Cơ sở": "BranchScreen",
    "Ghi danh": "EnrollmentScreen",
    "Điểm danh tập thử": "TrialAttendanceScreen",
};

// Hàm helper để lấy screen name từ feature title
export const getFeatureScreenName = (title: string): string | null => {
    return featureScreenMap[title] || null;
};

// Hàm navigation helper
export const navigateToFeature = (title: string, navigation: any, scoreData?: any): boolean => {
    const screenName = getFeatureScreenName(title);

    if (screenName) {
        try {
            console.log(`🚀 Navigating to: ${title} → ${screenName}`);

            // Nếu có scoreData thì truyền kèm params
            if (scoreData) {
                // console.log('📊 Passing score data:', scoreData);
                navigation.navigate(screenName, { scoreData, title: scoreData?.type });
            } else {
                navigation.navigate(screenName, { title });
            }

            return true;
        } catch (error) {
            console.error(`❌ Navigation error for ${title}:`, error);
            return false;
        }
    } else {
        console.warn(`⚠️ No screen found for feature: ${title}`);
        return false;
    }
};