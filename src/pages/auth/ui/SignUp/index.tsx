import { type MouseEventHandler, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";

import { useSignUpMutation } from "@/features/auth";

import { signUpSchema, type SignUpSchema } from "@/entities/auth/model";

import { imageMountain } from "@/shared/ui/assets/images";
import { Button, Input } from "@/shared/ui/components";
import { DvhMinHeightLayout } from "@/shared/ui/Layout";

import styles from "./signUpPage.module.scss";

// TODO: 인증번호 관련 로직 분리 필요해보임
const SignUpPage: React.FC = () => {
	const subRef = useRef<string | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, disabled, isSubmitSuccessful },
	} = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		mode: "onTouched",
	});

	const { mutateAsync: signUp } = useSignUpMutation();

	const onClickClear: MouseEventHandler<HTMLButtonElement> = (e) => {
		const name = e.currentTarget.name as keyof SignUpSchema;
		setValue(name, "", { shouldValidate: true });
	};

	const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
		if (disabled) return;
		const { sub } = await signUp(data);
		subRef.current = sub;
	};

	return (
		<main>
			<DvhMinHeightLayout minHeight="100dvh" className={styles.wrapper}>
				<img src={imageMountain} alt="산" className={styles.mountain} />
				<h1 className={styles.title}>등산로 추천 서비스</h1>
				<h2 className={styles.text}>회원가입</h2>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<Input
						required
						size="medium"
						label="이메일"
						className={styles.input}
						placeholder="이메일을 입력하세요"
						errorMessage={errors.email?.message}
						type="email"
						inputMode="email"
						onClickClear={onClickClear}
						disabled={isSubmitting || isSubmitSuccessful}
						autoComplete="email"
						{...register("email")}
					/>
					<Input
						required
						size="medium"
						label="비밀번호"
						className={styles.input}
						placeholder="비밀번호를 입력하세요"
						errorMessage={errors.password?.message}
						type="password"
						onClickClear={onClickClear}
						disabled={isSubmitting || isSubmitSuccessful}
						autoComplete="new-password"
						{...register("password")}
					/>
					{!isSubmitSuccessful && (
						<Button type="submit" buttonType="primary" full className={styles.loginButton} disabled={isSubmitting}>
							회원가입
						</Button>
					)}
					{isSubmitSuccessful && (
						<Input
							required
							size="medium"
							label="인증코드"
							placeholder="메일로 전송 된 인증코드 6자리를 입력하세요."
							type="number"
							className={styles.input}
						/>
					)}
					<Link className={styles.signUpLink} to="/auth">
						<Button buttonType="tertiary" className={styles.signUpLink} type="button">
							로그인 하러 가기
						</Button>
					</Link>
				</form>
			</DvhMinHeightLayout>
		</main>
	);
};

export default SignUpPage;
