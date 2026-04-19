import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import ReviewPage from './ReviewPage';

jest.mock('../http/api', () => ({
  getHistory: jest.fn(() => Promise.resolve([])),
  getTasks: jest.fn(() => Promise.resolve([])),
  getMoodHistory: jest.fn(() => Promise.resolve([])),
  getFocusHistory: jest.fn(() => Promise.resolve([])),
  getReviewInsights: jest.fn(() => Promise.resolve({ daily: '', weekly: '', monthly: '' })),
  getWeeklySummary: jest.fn(() => Promise.resolve({ summary: '' })),
}));

jest.mock('../i18n/LanguageContext', () => ({
  useLanguage: () => ({
    lang: 'zh',
    t: {
      loadingHistory: '加载中',
      reviewTitle: '复盘',
      navSettings: '设置',
      taskKindTemporary: '临时',
      taskKindWeekly: '每周',
    },
  }),
}));

const { getTasks, getHistory } = require('../http/api');

describe('ReviewPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-24T12:00:00.000Z'));
    jest.clearAllMocks();
    getHistory.mockResolvedValue([]);
    getTasks.mockImplementation((status, query) => {
      if (status === 'all' && query === 'Fellowship:') {
        return Promise.resolve([
          {
            id: 100,
            title: 'Fellowship: Submit research topic proposal',
            task_kind: 'temporary',
            status: 'active',
            due_date: '2026-06-09',
          },
          {
            id: 101,
            title: 'Fellowship: Join weekly AI Product Standup',
            task_kind: 'weekly',
            status: 'active',
            recurrence_weekday: 3,
            due_date: null,
          },
        ]);
      }
      return Promise.resolve([
        {
          id: 7,
          title: '每周二要去打工',
          task_kind: 'weekly',
          recurrence_weekday: 1,
          due_date: null,
        },
      ]);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not add a calendar plan badge for recurring tasks alone', async () => {
    render(
      <MemoryRouter>
        <ReviewPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('每周二要去打工')).toBeInTheDocument();
    });

    expect(screen.queryByText('计划 1')).not.toBeInTheDocument();
  });

  it('keeps the calendar plan badge for one-off scheduled tasks', async () => {
    getTasks.mockImplementation((status, query) => {
      if (status === 'all' && query === 'Fellowship:') {
        return Promise.resolve([
          {
            id: 100,
            title: 'Fellowship: Submit research topic proposal',
            task_kind: 'temporary',
            status: 'active',
            due_date: '2026-06-09',
          },
        ]);
      }
      return Promise.resolve([
        {
          id: 8,
          title: '给女朋友过生日',
          task_kind: 'temporary',
          due_date: '2026-03-24',
        },
      ]);
    });

    render(
      <MemoryRouter>
        <ReviewPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('给女朋友过生日')).toBeInTheDocument();
    });

    expect(screen.getAllByText('计划 1').length).toBeGreaterThan(0);
  });

  it('renders the fellowship program board with official coverage stats', async () => {
    render(
      <MemoryRouter>
        <ReviewPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('项目总览')).toBeInTheDocument();
    });

    expect(screen.getByText('官方任务覆盖')).toBeInTheDocument();
    expect(screen.getByText('2/13')).toBeInTheDocument();
  });

  it('does not show planned history items for tasks scheduled on a later date', async () => {
    getHistory.mockResolvedValue([
      {
        id: 1,
        task_id: 90,
        task_title: '明天交给导师的文档',
        action: 'planned',
        date: '2026-03-24',
        ai_reasoning: 'Included in today plan.',
      },
    ]);
    getTasks.mockImplementation((status, query) => {
      if (status === 'all' && query === 'Fellowship:') {
        return Promise.resolve([]);
      }
      return Promise.resolve([
        {
          id: 90,
          title: '明天交给导师的文档',
          task_kind: 'temporary',
          status: 'active',
          due_date: '2026-03-25',
        },
      ]);
    });

    render(
      <MemoryRouter>
        <ReviewPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/复盘日历/)).toBeInTheDocument();
    });

    expect(screen.queryByText('明天交给导师的文档')).not.toBeInTheDocument();
  });

  it('keeps completed dated tasks in the review schedule', async () => {
    getTasks.mockImplementation((status, query) => {
      if (status === 'all' && query === 'Fellowship:') {
        return Promise.resolve([]);
      }
      return Promise.resolve([
        {
          id: 91,
          title: '已经完成的申请材料',
          task_kind: 'temporary',
          status: 'completed',
          due_date: '2026-03-24',
        },
      ]);
    });

    render(
      <MemoryRouter>
        <ReviewPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('已经完成的申请材料')).toBeInTheDocument();
    });

    expect(screen.getAllByText('计划 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('完成').length).toBeGreaterThan(0);
  });
});
