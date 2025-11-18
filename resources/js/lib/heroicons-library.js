/**
 * Curated collection of Heroicons for Task Group selection
 * Using outline style (24x24) for consistency
 */
import {
    BugAntIcon,
    LightBulbIcon,
    ClockIcon,
    ChatBubbleBottomCenterTextIcon,
    CheckCircleIcon,
    FunnelIcon,
    CogIcon,
    QueueListIcon,
    HandThumbUpIcon,
    RocketLaunchIcon,
    FlagIcon,
    ChartBarIcon,
    CodeBracketIcon,
    UserGroupIcon,
    CalendarIcon,
    BoltIcon,
    SparklesIcon,
    BeakerIcon,
    CpuChipIcon,
    PaintBrushIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    MegaphoneIcon,
    CubeIcon,
    WrenchScrewdriverIcon,
    ArchiveBoxIcon,
    StarIcon,
    FireIcon,
    TrophyIcon,
    HeartIcon,
    EyeIcon,
    PencilSquareIcon,
    MapIcon,
    GlobeAltIcon,
    CommandLineIcon,
    ServerIcon,
    DevicePhoneMobileIcon,
    ComputerDesktopIcon,
    CloudIcon,
    CreditCardIcon,
    ChartPieIcon,
    PresentationChartBarIcon,
    CurrencyDollarIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    BookOpenIcon,
    NewspaperIcon,
    MusicalNoteIcon,
    VideoCameraIcon,
} from '@heroicons/react/24/outline';

/**
 * Predefined icon library for task groups
 * Each entry contains:
 * - id: unique identifier stored in database
 * - name: display name in UI
 * - component: React component from Heroicons
 * - category: grouping for better organization (optional future use)
 */
export const PREDEFINED_ICONS = [
    // Development & Code
    { id: 'bug', name: 'Bug Fixes', component: BugAntIcon, category: 'development' },
    { id: 'code-bracket', name: 'Development', component: CodeBracketIcon, category: 'development' },
    { id: 'command-line', name: 'CLI / Scripts', component: CommandLineIcon, category: 'development' },
    { id: 'cpu-chip', name: 'Performance', component: CpuChipIcon, category: 'development' },
    { id: 'server', name: 'Backend', component: ServerIcon, category: 'development' },
    { id: 'device-mobile', name: 'Mobile', component: DevicePhoneMobileIcon, category: 'development' },
    { id: 'computer-desktop', name: 'Desktop', component: ComputerDesktopIcon, category: 'development' },
    { id: 'cloud', name: 'Cloud / Infrastructure', component: CloudIcon, category: 'development' },

    // Planning & Ideas
    { id: 'lightbulb', name: 'Ideas', component: LightBulbIcon, category: 'planning' },
    { id: 'map', name: 'Roadmap', component: MapIcon, category: 'planning' },
    { id: 'flag', name: 'Milestone', component: FlagIcon, category: 'planning' },
    { id: 'rocket', name: 'Launch', component: RocketLaunchIcon, category: 'planning' },
    { id: 'sparkles', name: 'Innovation', component: SparklesIcon, category: 'planning' },
    { id: 'beaker', name: 'Experimental', component: BeakerIcon, category: 'planning' },

    // Progress & Status
    { id: 'clock', name: 'In Progress', component: ClockIcon, category: 'status' },
    { id: 'check-circle', name: 'Completed', component: CheckCircleIcon, category: 'status' },
    { id: 'bolt', name: 'High Priority', component: BoltIcon, category: 'status' },
    { id: 'fire', name: 'Urgent', component: FireIcon, category: 'status' },
    { id: 'archive-box', name: 'Archived', component: ArchiveBoxIcon, category: 'status' },
    { id: 'queue-list', name: 'Backlog', component: QueueListIcon, category: 'status' },

    // Features & Functionality
    { id: 'chat', name: 'Communication', component: ChatBubbleBottomCenterTextIcon, category: 'features' },
    { id: 'user-group', name: 'Team', component: UserGroupIcon, category: 'features' },
    { id: 'shield-check', name: 'Security', component: ShieldCheckIcon, category: 'features' },
    { id: 'credit-card', name: 'Payments', component: CreditCardIcon, category: 'features' },
    { id: 'paint-brush', name: 'Design', component: PaintBrushIcon, category: 'features' },
    { id: 'eye', name: 'Visibility', component: EyeIcon, category: 'features' },
    { id: 'hand-thumb-up', name: 'User Feedback', component: HandThumbUpIcon, category: 'features' },

    // Organization & Management
    { id: 'calendar', name: 'Scheduling', component: CalendarIcon, category: 'organization' },
    { id: 'cog', name: 'Settings', component: CogIcon, category: 'organization' },
    { id: 'funnel', name: 'Filtering', component: FunnelIcon, category: 'organization' },
    { id: 'wrench', name: 'Maintenance', component: WrenchScrewdriverIcon, category: 'organization' },
    { id: 'cube', name: 'Components', component: CubeIcon, category: 'organization' },
    { id: 'briefcase', name: 'Business', component: BriefcaseIcon, category: 'organization' },

    // Analytics & Reporting
    { id: 'chart-bar', name: 'Analytics', component: ChartBarIcon, category: 'analytics' },
    { id: 'chart-pie', name: 'Metrics', component: ChartPieIcon, category: 'analytics' },
    { id: 'presentation', name: 'Reporting', component: PresentationChartBarIcon, category: 'analytics' },
    { id: 'currency-dollar', name: 'Revenue', component: CurrencyDollarIcon, category: 'analytics' },

    // Content & Documentation
    { id: 'document', name: 'Documentation', component: DocumentTextIcon, category: 'content' },
    { id: 'book', name: 'Knowledge Base', component: BookOpenIcon, category: 'content' },
    { id: 'newspaper', name: 'Blog / News', component: NewspaperIcon, category: 'content' },
    { id: 'academic-cap', name: 'Learning', component: AcademicCapIcon, category: 'content' },
    { id: 'pencil', name: 'Editing', component: PencilSquareIcon, category: 'content' },

    // Marketing & Communication
    { id: 'megaphone', name: 'Marketing', component: MegaphoneIcon, category: 'marketing' },
    { id: 'globe', name: 'Public Facing', component: GlobeAltIcon, category: 'marketing' },
    { id: 'musical-note', name: 'Audio', component: MusicalNoteIcon, category: 'marketing' },
    { id: 'video-camera', name: 'Video', component: VideoCameraIcon, category: 'marketing' },

    // Special & Achievements
    { id: 'star', name: 'Featured', component: StarIcon, category: 'special' },
    { id: 'trophy', name: 'Achievement', component: TrophyIcon, category: 'special' },
    { id: 'heart', name: 'Favorites', component: HeartIcon, category: 'special' },
];

/**
 * Get icon component by ID
 * @param {string} iconId - The icon identifier
 * @returns {React.Component|null} - The icon component or null
 */
export const getIconById = (iconId) => {
    const icon = PREDEFINED_ICONS.find(i => i.id === iconId);
    return icon ? icon.component : null;
};

/**
 * Get icon data by ID
 * @param {string} iconId - The icon identifier
 * @returns {Object|null} - The full icon object or null
 */
export const getIconDataById = (iconId) => {
    return PREDEFINED_ICONS.find(i => i.id === iconId) || null;
};

/**
 * Group icons by category
 * @returns {Object} - Icons grouped by category
 */
export const getIconsByCategory = () => {
    return PREDEFINED_ICONS.reduce((acc, icon) => {
        if (!acc[icon.category]) {
            acc[icon.category] = [];
        }
        acc[icon.category].push(icon);
        return acc;
    }, {});
};
