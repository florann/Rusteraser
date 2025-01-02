
/* Function to round a float number to the specify decimal */
pub fn round_to_decimals(num: f64, decimals: usize) -> f64 {
    let factor = 10_f64.powi(decimals as i32);
    (num * factor).round() / factor
}