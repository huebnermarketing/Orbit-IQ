<template>
  <div class="date-picker-wrapper">
    <div class="relative" ref="pickerRef">
      <div
        ref="triggerRef"
        :class="[
          'date-picker-input',
          'shadow-sm',
          error ? 'date-picker-input-error' : '',
          disabled ? 'date-picker-input-disabled' : '',
          isOpen ? 'date-picker-input-open' : '',
        ]"
        @click="togglePicker"
      >
        <span :class="['date-picker-display', !displayText ? 'text-text-placeholder' : '']">
          {{ displayText || placeholder }}
        </span>
        <div class="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
          <button
            v-if="hasValue && !disabled"
            type="button"
            class="date-picker-clear-btn"
            @click.stop="clearSelection"
            tabindex="-1"
          >
            <i class="fas fa-times text-text-muted hover:text-text-primary"></i>
          </button>
          <div class="pointer-events-none">
            <i class="far fa-calendar text-text-muted"></i>
          </div>
        </div>
      </div>

      <Transition name="calendar-fade">
        <div
          v-if="isOpen && !disabled"
          ref="calendarRef"
          class="date-picker-calendar"
          :style="floatingStyles"
          @click.stop
        >
          <div class="calendar-header">
            <div class="calendar-nav">
              <button
                type="button"
                class="calendar-nav-btn"
                @click.stop="previousPeriod"
                :disabled="isMinDate"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button type="button" class="calendar-title-btn" @click.stop="toggleViewMode">
                {{ currentPeriodLabel }}
              </button>
              <button
                type="button"
                class="calendar-nav-btn"
                @click.stop="nextPeriod"
                :disabled="isMaxDate"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <div v-if="mode === 'range' && selectedRange.start" class="calendar-range-info">
              <span class="text-xs text-text-muted">
                {{ formatDateForDisplay(selectedRange.start) }} -
                {{ selectedRange.end ? formatDateForDisplay(selectedRange.end) : '...' }}
              </span>
            </div>
          </div>

          <div class="calendar-body">
            <!-- Year View -->
            <div v-if="viewMode === 'year'" class="calendar-year-grid">
              <button
                v-for="year in yearRange"
                :key="year"
                type="button"
                :class="[
                  'calendar-year-cell',
                  isYearSelected(year) ? 'calendar-cell-selected' : '',
                  isYearDisabled(year) ? 'calendar-cell-disabled' : '',
                ]"
                @click.stop="selectYear(year)"
              >
                {{ year }}
              </button>
            </div>

            <!-- Month View -->
            <div v-else-if="viewMode === 'month'" class="calendar-month-grid">
              <button
                v-for="(month, index) in months"
                :key="index"
                type="button"
                :class="[
                  'calendar-month-cell',
                  isMonthSelected(index) ? 'calendar-cell-selected' : '',
                  isMonthDisabled(index) ? 'calendar-cell-disabled' : '',
                ]"
                @click.stop="selectMonth(index)"
              >
                {{ month }}
              </button>
            </div>

            <!-- Date/Week View -->
            <div v-else>
              <div class="calendar-weekdays">
                <div v-for="day in weekDays" :key="day" class="calendar-weekday">
                  {{ day }}
                </div>
              </div>
              <div class="calendar-days">
                <button
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  type="button"
                  :class="[
                    'calendar-day-cell',
                    day.isOtherMonth ? 'calendar-day-other-month' : '',
                    day.isToday ? 'calendar-day-today' : '',
                    isDaySelected(day.date) ? 'calendar-cell-selected' : '',
                    isDayInRange(day.date) ? 'calendar-day-in-range' : '',
                    isDayInWeekSelection(day.date) ? 'calendar-day-week-selected' : '',
                    isDayDisabled(day.date) ? 'calendar-cell-disabled' : '',
                  ]"
                  @click="selectDay(day.date)"
                  @mouseenter="handleDayHover(day.date)"
                >
                  {{ day.day }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="mode === 'multi'" class="calendar-footer">
            <button type="button" class="calendar-clear-btn" @click="clearSelection">Clear</button>
            <span class="text-xs text-text-muted"> {{ selectedDates.length }} selected </span>
          </div>
        </div>
      </Transition>
    </div>
    <p v-if="error" class="mt-1 text-sm text-error-500">{{ error }}</p>
    <p v-if="hint && !error" class="mt-1 text-sm text-text-muted">{{ hint }}</p>
  </div>
</template>

<script lang="ts" src="./DatePicker.ts"></script>
<style scoped src="./DatePicker.css"></style>
