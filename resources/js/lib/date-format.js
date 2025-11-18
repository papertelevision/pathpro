/**
 * External dependencies.
 */
import moment from 'moment';

export const dateFormat = (
    date,
    format,
    showTime = false,
    showMonth = false,
    separator = '-'
) => {
    if (showTime) {
        return moment(date).format(
            format === 'us'
                ? `M[${separator}]D[${separator}]YYYY [at] hh:mma`
                : format === 'uk'
                ? `D[${separator}]M[${separator}]YYYY [at] hh:mma`
                : `YYYY[${separator}]M[${separator}]D [at] hh:mma`
        );
    }

    if (showMonth) {
        return moment(date).format(
            format === 'us'
                ? 'MMM D, YYYY'
                : format === 'uk'
                ? 'D MMM, YYYY'
                : 'YYYY MMM, D'
        );
    }

    return moment(date).format(
        format === 'us'
            ? `M${separator}D${separator}YYYY`
            : format === 'uk'
            ? `D${separator}M${separator}YYYY`
            : `YYYY${separator}M${separator}D`
    );
};
